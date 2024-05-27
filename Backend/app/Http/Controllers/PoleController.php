<?php

namespace App\Http\Controllers;

use App\Http\Resources\PoleResource;
use App\Models\Pole;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PoleController extends Controller
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
                'libelle' => 'required|string',
                'direction_id' => 'required|exists:directions,id',
            ]);

            $pole =  Pole::firstOrNew([
                'libelle' => $request->libelle,
                'direction_id'=> $request->direction_id,
            ]);

                if(!$pole->exists){
                    $pole->save();
                };

            return new PoleResource($pole);
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
    public function show(Pole $pole)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pole $pole)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pole $pole)
    {
        try {
            $request->validate([
                'libelle' => 'required|string',
                'direction_id' => 'required|exists:directions,id',
            ]);

            $pole->update([
                'libelle' => $request->libelle,
                'direction_id' => $request->direction_id,
            ]);

            return new PoleResource($pole);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validation failed.', 'errors' => $e->validator->errors()->all()], 422);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Erreur de base de données.'], 500);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Une erreur est survenue lors du traitement de la requête.'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pole $pole)
    {
        try {
            $pole->delete();
            return response()->json(['message' => 'Pole supprimé avec succès.'], 204);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Erreur de base de données.'], 500);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Une erreur est survenue lors du traitement de la requête.'], 500);
        }
    }
}
