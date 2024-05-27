<?php

namespace App\Http\Controllers;

use App\Models\Departement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class DepartementController extends Controller
{
    public function store(Request $request)
    {
       try{
        return DB::transaction(function() use($request){
            $request->validate([
                'libelle' => 'required|string',
                'pole_id' => 'required|exists:poles,id',
            ]);

            $departement = Departement::firstOrNew([
                'libelle' => $request->libelle,
                'pole_id' => $request->pole_id,
            ]);
            if(!$departement->exists){
             $departement->save();

            }
            return response()->json([
                "status" => 200,
                "message" => "Département ajouté avec succès",
                "data" => $departement,
            ]);

        });

       }catch(QueryException $e){
        return response()->json([
            "statut"=>221,
            "message"=>"erreur",
            "data"=>$e->getMessage(),
        ]);
       }
    }
}
