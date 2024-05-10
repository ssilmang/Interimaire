<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Locau;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;

class LocalController extends Controller
{
    public function store(Request $request)
    {
        try {
        $request->validate([
            'libelle' => 'required|string',
            'adresse' => 'required|string',
        ]);

        $local = Locau::create([
            'libelle' => $request->libelle,
            'adresse' => $request->adresse,
        ]);

        return response()->json([
                "status" => 200,
                "message" => "lieu d'execution a ete ajouté avec succès",
                "data" => $local,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                "status" => 400,
                "message" => "Erreur de validation",
                "errors" => $e->errors(),
            ], 400);
        } catch (QueryException $e) {
            return response()->json([
                "status" => 500,
                "message" => "Erreur lors de l'ajout du lieu d'execution",
                "error" => $e->getMessage(),
            ], 500);
        }
    }
}
