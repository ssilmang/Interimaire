<?php

namespace App\Http\Controllers;

use App\Http\Resources\PermanentResource;
use App\Models\Direction;
use App\Models\Permanent;
use App\Models\Poste;
use App\Models\Profile;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class PermanentController extends Controller
{
    public $response ,$controller, $interimaire;
    
    public function __construct(ResponseController $response,HeriteController $controller,InterimController $interimaire)
    {
        $this->response = $response;
        $this->controller = $controller;
        $this->interimaire = $interimaire;
    }
    public function index()
    {
        $permanents = Permanent::all();
        return response()->json([
            'statut'=>Response::HTTP_OK,
            'message'=>'all permanents',
            'data'=>PermanentResource::collection($permanents)
        ]);
    }
    public function getPermanent()
    {
        $poste = Poste::where('libelle','Directeur des ventes')->first();
        $direction = Direction::where('libelle','DV')->first();
        $permanent = Permanent::where(['poste_id'=>$poste->id,'direction_id'=>$direction->id])->first();
        $data =["dvs"=>PermanentResource::make($permanent)];    
        return $this->response->response(Response::HTTP_OK,'index permanent dv',$data);
    }
    public function store(Request $request)
    {
        try{
            return DB::transaction(function() use($request)
            {     
                $valide = $request->validate([
                    'statut_id'=>'required'
                ]);
                $file ="";
                $photo = '';
                if($request->hasfile('photo'))
                {
                    $file = $request->file('photo');
                    $extension = $file->getClientOriginalExtension();
                    $filename = time().'.'. $extension;
                    $photo = $filename;
                }
                $statut = $this->controller->store($request->statut_id,"Statut","statut");
               $profile = $this->controller->UserProfile($request,$photo);
               if($statut->libelle === "Interimaire")
               {
                $file->move('uploads/Interims/',$filename);
                $interim =$this->interimaire->store($request,$statut,$profile);
                return $interim;
               }else
               {
                   $validate = $request->validate([
                       'poste_id'=>'required',
                       'canal_id'=>'required',
                       'groupe_id'=>'required',
                       'categorie_id'=>'required',
                       'agence_id'=>'required',
                       'statut_id'=>'required',
                    ]);
                    $canal = $this->controller->store($request->canal_id,"Canal","Canal");
                    $agence = $this->controller->store($request->agence_id,"Agence","Agence");
                    $groupe = $this->controller->store($request->groupe_id,"Groupe","Groupe");
                    $categorie = $this->controller->store($request->categorie_id,"Categoriegroupe","Categorie de groupe");
                    $poste = $this->controller->store($request->poste_id,"Poste","Poste");
                    $locau = $this->controller->store($request->locau_id,"Locau","locau");         
                    $service = 0; $direction = 0; $pole = 0; $departement = 0;            
                    if(isset($request->direction_id))
                    {
                        $direction = $this->controller->store($request->direction_id,"Direction","direction");
                    }
                    if(isset($request->pole_id))
                    {
                        $pole = $this->controller->create($request->pole_id,'direction_id',$direction->id,"Pole","pole");
                    }
                    if(isset($request->departement_id))
                    {
                        $departement = $this->controller->create($request->departement_id,'pole_id',$pole->id,"Departement","departement");
                    }
                    if(isset($request->service_id))
                    {
                        $service = $this->controller->create($request->service_id,'departement_id',$departement->id,"Service","service");
                    }
                    if(isset($request->agenceCommercial_id))
                    {
                        $service = $this->controller->create($request->agenceCommercial_id,'departement_id',$departement->id,"AgenceCommercial","agenceCommercial");
                    }
                    $file->move('uploads/higlights/',$filename);
                    $permanent = Permanent::firstOrCreate([
                        'profile_id'=>$profile->id,
                        'poste_id'=>$poste->id,
                        'canal_id'=>$canal->id,
                        'statut_id'=>$statut->id,
                        'groupe_id'=>$groupe->id,
                        'locau_id'=>$locau->id,
                        'categoriegroupe_id'=>$categorie->id,
                        'agence_id'=>$agence->id,
                        'direction_id'=>$direction->id,
                        'pole_id'=>$request->pole_id? $pole->id : null,
                        'departement_id'=>$request->departement_id? $departement->id : null,
                        'service_id'=>$request->service_id? $service->id : null,
                        'responsable_id'=>$request->responsable_id,
                    ]);
                    return $this->response->response(Response::HTTP_OK,"permanents ajouter avec succès",$permanent);
               }
            });

        }catch(QueryException $e)
        {
          return $this->response->response(Response::HTTP_BAD_REQUEST,"erreur",$e->getMessage());
        }
    }
}
