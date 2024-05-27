<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;

class ServiceController extends Controller
{

     public function index()
    {
        try {
            // Récupérer tous les services avec leurs chefs de service
            $services = Service::with('departement')->get();

            // Retourner les services sous forme de réponse JSON avec le libellé du chef de service
            return response()->json([
                'status' => 200,
                'data' => $services->map(function ($service) {
                    return [
                        'id' => $service->id,
                        'libelle' => $service->libelle,
                        'departement' => $service->departement ? $service->departement->libelle : null,
                    ];
                }),
            ]);
        } catch (\Exception $e) {
            // Gérer les erreurs éventuelles
            return response()->json([
                'status' => 500,
                'message' => 'Une erreur est survenue lors de la récupération des services.',
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'libelle' => 'required|string',
                'departement_id' => 'required|exists:departements,id',
            ]);

            $service = Service::firstOrCreate([
                'libelle' => $request->libelle,
                'departement_id' => $request->departement_id,
            ]);

            return response()->json([
                "status" => 200,
                "message" => "Service ajouté avec succès",
                "data" => $service,
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
                "message" => "Erreur lors de l'ajout du service",
                "error" => $e->getMessage(),
            ], 500);
        }
    }
}
