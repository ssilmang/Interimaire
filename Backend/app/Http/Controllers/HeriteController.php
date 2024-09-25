<?php

namespace App\Http\Controllers;

use App\Models\Permanent;
use App\Models\PermanentOfRemplace;
use App\Models\Profile;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

use function PHPUnit\Framework\isNan;

class HeriteController extends Controller
{
    public $responseController;
    public function __construct(ResponseController $responseController)
    {
        $this->responseController = $responseController;
    }
    public  function store($libelle,$model,$message)
    {
        try{
            return DB::transaction(function () use($libelle,$model,$message)
            {
                $modelClass = "\\App\\Models\\" . $model;
                $statut =0;
                if(!is_numeric($libelle) && $libelle != null)
                {
                    $statut = $modelClass::firstOrCreate([
                        "libelle"=>$libelle
                    ]);
                }else
                {
                    $statut = $modelClass::find($libelle);
                }
                return $statut;
            });
        }catch(QueryException $e){
            return $this->responseController->response(Response::HTTP_BAD_REQUEST,"erreur",$e->getMessage());
            
        }
    }
   
    public  function create($libelle,$cle,$cleEtrangere,$model,$message)
    {
        try{
            return DB::transaction(function () use($libelle,$cle,$cleEtrangere,$model,$message)
            {
                $modelClass = "\\App\\Models\\" . $model;
                $statut =0;
                if(!is_numeric($libelle) && $libelle !=null){
                    $statut = $modelClass::firstOrCreate([
                        "libelle"=>$libelle,
                    ],[
                        $cle=>$cleEtrangere,
                    ]);
                }else
                {
                    $statut = $modelClass::find($libelle);
                }
                return $statut;
            });
        }catch(QueryException $e){
            return $this->responseController->response(Response::HTTP_BAD_REQUEST,"erreur",$e->getMessage());
            
        }
    }
    public function index($model){
        $class = "\\App\\Models\\" . $model;
        $statut = null;
        if($model !='Permanent'){
            $statut =  $class::all();

        }else{
            $statut = $class::where('etat',0)->get();
        } 
        return $statut;
    }
    public function UserProfile(Request $request,$photo){
        try{

            return DB::transaction(function() use($request,$photo)
            {
                  Validator::validate($request->all(),[
                      'prenom'=>'required|string',
                      'nom'=>'required|string',
                      'matricule'=>'required|string|unique:profiles,matricule',
                      'email'=>'required|unique:profiles,email',
                      'telephone'=>['required','regex:/^(77|76|78|70|75)\d{7}$/','unique:profiles,telephone'],
                  ]);
                  $profile = Profile::firstOrCreate([
                      'nom'=>$request->nom,
                      'prenom'=>$request->prenom,
                      'matricule'=>$request->matricule,
                      'email'=>$request->email,
                      'telephone'=>$request->telephone,
                      'telephone_pro'=>$request->telephone_pro ? $request->telephone_pro : 0,
                      'photo'=>$photo,
                      'contrat'=>$request->contrat,
                      'adresse'=>$request->adresse,
                      'commentaire'=>$request->commentaire,
                  ]);
                  return $profile;
              });
        }catch(QueryException $e){
            return $this->responseController->response(Response::HTTP_BAD_REQUEST,"erreur",$e->getMessage());
        }
    }
    public function updateUserProfile(Request $request,$photo, $id)
    {
       try{
        return DB::transaction(function() use($request,$photo,$id){
            
            $profile = Profile::find($id);
            $profile->prenom = $request->prenom;
            $profile->nom = $request->nom;
            $profile->matricule = $request->matricule;
            $profile->email = $request->email;
            $profile->telephone = $request->telephone;
            $profile->telephone_pro = $request->telephone_pro ? $request->telephone_pro : 0;
            $profile->photo = $photo;
            $profile->contrat = $request->contrat;
            $profile->adresse = $request->adresse;
            $profile->commentaire = $request->commentaire;
            $profile->save();
            return $profile;
        });
       }catch(QueryException $e){
         return $this->responseController->response(Response::HTTP_BAD_REQUEST,"erreur",$e->getMessage());
       }
    }
    public function remplacementOfPermanent(Request $request,$id){
        $permanentARemplacer  = Permanent::find($id);
        $permOfRemp = PermanentOfRemplace::updateOrCreate([
            'profile_id'=>$permanentARemplacer->profile_id],[
            'poste_id'=>$permanentARemplacer->poste_id,
            'canal_id'=>$permanentARemplacer->canal_id,
            'statut_id'=>$permanentARemplacer->statut_id,
            'groupe_id'=>$permanentARemplacer->groupe_id,
            'locau_id'=>$permanentARemplacer->locau_id,
            'categoriegroupe_id'=>$permanentARemplacer->categoriegroupe_id,
            'agence_id'=>$permanentARemplacer->agence_id,
            'direction_id'=>$permanentARemplacer->direction_id,
            'pole_id'=>$permanentARemplacer->pole_id? $permanentARemplacer->pole_id : null,
            'departement_id'=>$permanentARemplacer->departement_id? $permanentARemplacer->departement_id : null,
            'service_id'=>$permanentARemplacer->service_id? $permanentARemplacer->service_id : null,
            'responsable_id'=>$permanentARemplacer->responsable_id?$permanentARemplacer->responsable_id : null,
            'date'=>$permanentARemplacer->date,
            'motif'=>$permanentARemplacer->motif,
            'commentaire'=>$permanentARemplacer->commentaire,
            'etat'=>1,
        ]);
    }

}
