<?php

namespace App\Http\Controllers;

use App\Http\Resources\PosteResource;
use App\Models\Poste;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class PosteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $postes = Poste::all();
            return PosteResource::collection($postes);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Erreur de base de données.'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function create(Request $request)
    {
        //
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    try {
        $request->validate([
            'libelle' => 'required|string',
            'duree_kangurou' => 'nullable',
            'montant_kangurou' => 'nullable',
        ]);
        
        $duree_kangurou = null;
        if($request->duree_kangurou!=null){
            $duree = explode(" ",$request->duree_kangurou);
            if($duree[1]==="mois"){
                $duree_kangurou = $duree[0] * 30;
            }else if($duree[0]==='semaine'){
                $duree_kangurou = $duree[0] * 7;
                
            }else{
                $duree_kangurou = $duree[0] * 7;
            }
        }
   
        $poste = Poste::firstOrCreate([
            'libelle' => $request->libelle,
            'duree_kangurou' => $duree_kangurou?$duree_kangurou:null,
            'montant_kangurou' => $request->montant_kangurou?$request->montant_kangurou:null,
        ]);

        return response()->json([
            'statut'=>Response::HTTP_OK,
            'message'=>'Poste ajouter avec succès',
            'data'=>$poste
        ]);
    } catch (ValidationException $e) {
        return response()->json(['message' => 'Validation failed.', 'errors' => $e->validator->errors()->all()], 422);
    } catch (QueryException $e) {
        return response()->json(['message' => 'Erreur de base de données.'], 500);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Une erreur est survenue lors du traitement de la requête.'.$e->getMessage()], 500);
    }
}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
