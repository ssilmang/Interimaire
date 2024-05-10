<?php

namespace App\Http\Controllers;

use App\Http\Resources\PosteResource;
use App\Models\Poste;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

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
            'duree_kangurou' => 'nullable|integer',
            'montant_kangurou' => 'nullable|numeric',
        ]);

        $poste = Poste::create([
            'libelle' => $request->libelle,
            'duree_kangurou' => $request->duree_kangurou,
            'montant_kangurou' => $request->montant_kangurou,
        ]);

        return new PosteResource($poste);
    } catch (ValidationException $e) {
        return response()->json(['message' => 'Validation failed.', 'errors' => $e->validator->errors()->all()], 422);
    } catch (QueryException $e) {
        return response()->json(['message' => 'Erreur de base de données.'], 500);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Une erreur est survenue lors du traitement de la requête.'], 500);
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
