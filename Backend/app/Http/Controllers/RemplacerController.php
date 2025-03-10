<?php

namespace App\Http\Controllers;

use App\Http\Resources\RemplacementResource;
use App\Models\Remplacer;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class RemplacerController extends Controller
{
    public function index(Request $request)
    {
        try{
           return DB::transaction(function() use($request){
                $remplacer = Remplacer::with(['profileRemplacer','profileRemplacant'])->get();
                $interimResources = $remplacer->map(function ($inte) {
                    return new RemplacementResource($inte, 'interimaire');
                });
                return response()->json([
                    "statut"=>Response::HTTP_OK,
                    "message"=>"all remplcement",
                    "data"=>$interimResources
                ]);
            });

        }catch(QueryException $e){
            return response()->json([
                "statut"=>Response::HTTP_BAD_REQUEST,
                'message'=>"erreur",
                'data'=>$e->getMessage(),
            ]);
        }
    }
}
