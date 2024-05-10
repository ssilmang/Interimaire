<?php

namespace App\Http\Controllers;

use App\Http\Resources\RemplacementResource;
use App\Models\remplacement;
use App\Models\remplacements;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class RemplacementsController extends Controller
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
            $request->validate([
                'contrat_id' => 'required|exists:contrats,id',
                'statut' => 'required|string',
            ]);

            $remplacement = remplacement::create([
                'contrat_id' => $request->contrat_id,
                'statut' => $request->statut,
            ]);

            return new RemplacementResource($remplacement);
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
    public function show(remplacement $remplacements)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(remplacement $remplacements)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, remplacement $remplacements)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(remplacement $remplacements)
    {
        //
    }
}
