<?php

namespace App\Http\Controllers;

use App\Models\agence_commercials;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class AgenceCommercialsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
{
    try {
        return DB::transaction(function() use($request){
            $request->validate([
                'libelle' => 'required|string',
                'adresse' => 'required|string',
                'departement_id' => 'required|exists:departements,id',
            ]);

            $agence_commercials = agence_commercials::create([
                'libelle' => $request->libelle,
                'adresse' => $request->adresse,
                'departement_id' => $request->departement_id,
            ]);

            return response()->json([
                "status" => 200,
                "message" => "Agence commercial ajouté avec succès",
                "data" => $agence_commercials,
            ]);
        });
    } catch(QueryException $e) {
        return response()->json([
            "statut" => 221,
            "message" => "erreur",
            "data" => $e->getMessage(),
        ]);
    }
}



    /**
     * Display the specified resource.
     */
    public function show(agence_commercials $agence_commercials)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(agence_commercials $agence_commercials)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, agence_commercials $agence_commercials)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(agence_commercials $agence_commercials)
    {
        //
    }
}
