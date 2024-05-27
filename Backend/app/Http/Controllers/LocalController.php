<?php

namespace App\Http\Controllers;

use App\Http\Resources\LocauResource;
use Illuminate\Http\Request;
use App\Models\Locau;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class LocalController extends Controller
{
    public function index(Request $request){
        $locaux = Locau::all();
        return response()->json([
            'statut'=>Response::HTTP_OK,
            'message'=>'all',
            'data'=>[
                "locaux"=>LocauResource::collection($locaux)
            ]
        ]);
    }
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
                "statut" => 200,
                "message" => "lieu d'execution a ete ajouté avec succès",
                "data" => $local,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                "statut" => 400,
                "message" => "Erreur de validation",
                "errors" => $e->errors(),
            ], 400);
        } catch (QueryException $e) {
            return response()->json([
                "statut" => 500,
                "message" => "Erreur lors de l'ajout du lieu d'execution",
                "error" => $e->getMessage(),
            ], 500);
        }
    }
}
