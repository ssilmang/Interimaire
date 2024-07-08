<?php

namespace App\Http\Controllers;

use App\Http\Resources\PermanentResource;
use App\Models\AgenceCommercial;
use App\Models\Direction;
use App\Models\Interim;
use App\Models\Permanent;
use App\Models\Poste;
use App\Models\Prestataire;
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
    public function index(Request $request, $id)
    {
        $permanents = Permanent::where('id',$id)->first();
        return response()->json([
            'statut'=>Response::HTTP_OK,
            'message'=>'all permanents',
            'data'=>PermanentResource::make($permanents)
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
    public function store(Request $request,$id=0,$idProfile=0,$upload="null",$contrat_id=0)
    {
        
        try{
            return DB::transaction(function() use($request,$id,$idProfile,$upload,$contrat_id)
            {     
                $valide = $request->validate([
                    'statut'=>'required'
                ]);
                $file ="";
                $photo = '';
                $profile=0;
                $idInterim =  Interim::find($id);
                $idPermanent = Permanent::find($id);
                $idPrestataire = Prestataire::find($id);

                if($upload == "null"){
                    if($request->hasfile('photo'))
                    {
                        $file = $request->file('photo');
                        $extension = $file->getClientOriginalExtension();
                        $filename = time().'.'. $extension;
                        $photo = $filename;
                    }
                }else{
                    $photo=$request->photo;
                }
                
                $statut = $this->controller->store($request->statut,"Statut","statut");
                if($idProfile == 0){
                    $profile =  $this->controller->UserProfile($request,$photo);
                }else{
                    $profile =$this->controller->updateUserProfile($request,$photo,$idProfile);
                }    
               if($statut->libelle === "Interimaire")
               {
                if($upload == "null"){
                    $file->move('uploads/Interims/',$filename);
                }

                if($id!=0){
                   $int= $this->interimaire->update($request,$id,$statut,$profile,$contrat_id);
                   return $int;
                }else{
                    $interim =$this->interimaire->store($request,$statut,$profile);
                   return $interim;
                }

               }else
               {
                   $validate = $request->validate([
                       'poste'=>'required',
                       'canal'=>'required',
                       'groupe'=>'required',
                       'categorie'=>'required',
                       'agence'=>'required',
                       'statut'=>'required',
                    ]);
                    $canal = $this->controller->store($request->canal,"Canal","Canal");
                    $agence = $this->controller->store($request->agence,"Agence","Agence");
                    $groupe = $this->controller->store($request->groupe,"Groupe","Groupe");
                    $categorie = $this->controller->store($request->categorie,"Categoriegroupe","Categorie de groupe");
                    $poste = $this->controller->store($request->poste,"Poste","Poste");
                    $locau = $this->controller->store($request->locau,"Locau","locau");         
                    $service = 0; $direction = 0; $pole = 0; $departement = 0; $commercial =0;          
                    if(isset($request->direction) && $request->direction!= "null")
                    {
                        $direction = $this->controller->store($request->direction,"Direction","direction");
                    }
                    if(isset($request->pole) && $request->pole !="null" )
                    {
                        
                        $pole = $this->controller->create($request->pole,'direction_id',$direction->id,"Pole","pole");
                    }
                    if(isset($request->departement) && $request->departement!=="null")
                    
                    {
                        $departement = $this->controller->create($request->departement,'pole_id',$pole->id,"Departement","departement");
                    }
                    if(isset($request->service) && $request->service!=="null" )
                    {
                        $service = $this->controller->create($request->service,'departement_id',$departement->id,"Service","service");
                        
                    }
                    if(isset($request->agence_commercial) && $request->agence_commercial !== "null" )
                    {
                        $commercial = $this->controller->create($request->agence_commercial,'departement_id',$departement->id,"AgenceCommercial","agenceCommercial");
                    }
                    if($statut->libelle === "Prestataire")
                    {

                        if($upload == "null"){
                            $file->move('uploads/prestataire/',$filename);
                        }
                       if($id!=0){

                            $idPrestataire->profile_id=$profile->id;
                            $idPrestataire->poste_id=$poste->id;
                            $idPrestataire->canal_id=$canal->id;
                            $idPrestataire->statut_id=$statut->id;
                            $idPrestataire->groupe_id=$groupe->id;
                            $idPrestataire->locau_id=$locau->id;
                            $idPrestataire->categoriegroupe_id=$categorie->id;
                            $idPrestataire->agence_id=$agence->id;
                            $idPrestataire->direction_id=$direction->id;
                            $idPrestataire->pole_id=$pole? $pole->id : null;
                            $idPrestataire->departement_id=$departement? $departement->id :null;
                            $idPrestataire->service_id=$service? $service->id : null;
                            $idPrestataire->agence_commercial_id=$commercial?$commercial->id:null;
                            $idPrestataire->responsable_id=$request->responsable;
                            $idPrestataire->save();
                        
                        return $this->response->response(Response::HTTP_OK,"Prestataire mise en jour avec succès",$idPrestataire);
                       }
                       else{
                        $prestataire = Prestataire::firstOrCreate([
                            'profile_id'=>$profile->id,
                            'poste_id'=>$poste->id,
                            'canal_id'=>$canal->id,
                            'statut_id'=>$statut->id,
                            'groupe_id'=>$groupe->id,
                            'locau_id'=>$locau->id,
                            'categoriegroupe_id'=>$categorie->id,
                            'agence_id'=>$agence->id,
                            'direction_id'=>$direction->id,
                            'pole_id'=>$request->pole? $pole->id :null,
                            'departement_id'=>$request->departement? $departement->id : null,
                            'service_id'=>$request->service? $service->id :null,
                            'agence_commercial_id'=>$request->agence_commercial?$commercial->id:null,
                            'responsable_id'=>$request->responsable,
                        ]);
                        return $this->response->response(Response::HTTP_OK,"prestataire ajouter avec succès",$prestataire);
                       }
                    }else
                    {
                        
                        if($upload === "null"){
                            $file->move('uploads/higlights/',$filename);
                        }
                       
                        if($id!= 0){
                           $permanent = Permanent::find($id);
                            $permanent->profile_id=$profile->id;
                            $permanent->poste_id=$poste->id;
                            $permanent->canal_id=$canal->id;
                            $permanent->statut_id=$statut->id;
                            $permanent->groupe_id=$groupe->id;
                            $permanent->locau_id=$locau->id;
                            $permanent->categoriegroupe_id=$categorie->id;
                            $permanent->agence_id=$agence->id;
                            $permanent->direction_id=$direction->id;
                            $permanent->pole_id=$pole? $pole->id : null;                        
                            $permanent->departement_id=$departement? $departement->id :null;
                            $permanent->service_id=$service? $service->id :null;
                            $permanent->agence_commercial_id=$commercial?$commercial->id:null;
                            $permanent->responsable_id=$request->responsable;
                            $permanent->save();
                            return $this->response->response(Response::HTTP_OK,"permanent mise en jour avec succès",$permanent);
                        }
                        else{
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
                                'pole_id'=>$request->pole? $pole->id : null,
                                'departement_id'=>$request->departement? $departement->id : null,
                                'service_id'=>$request->service? $service->id : null,
                                'agence_commercial_id'=>$request->agence_commercial?$commercial->id:null,
                                'responsable_id'=>$request->responsable,
                            ]);
                            return $this->response->response(Response::HTTP_OK,"permanent ajouter avec succès",$permanent);
                        }

                    }
               }
            });

        }catch(QueryException $e)
        {
          return $this->response->response(Response::HTTP_BAD_REQUEST,"erreur",$e->getMessage());
        }
    }
}
