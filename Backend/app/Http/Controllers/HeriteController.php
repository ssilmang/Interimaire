<?php

namespace App\Http\Controllers;

use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
}
