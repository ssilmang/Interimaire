<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
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
                if(!is_numeric($libelle))
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
                if(!is_numeric($libelle)){
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
        $statut =  $class::all();
        return $statut;
    }
    public function UserProfile(Request $request,$photo){
        Validator::validate($request->all(),[
                    'prenom'=>'required',
                    'nom'=>'required',
                    'matricule'=>'required|string|unique:profiles,matricule',
                    'email'=>'required|unique:profiles,email',
                    'telephone'=>['required','string','regex:/^(77|76|78|70|75)\d{7}$/','unique:profiles,telephone'],
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
    }
}
