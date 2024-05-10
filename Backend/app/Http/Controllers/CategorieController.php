<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class CategorieController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'libelle' => 'required|string|max:255',
                'agence_id' => 'required|exists:agences,id',
            ]);

            $categorie = Categorie::create([
                'libelle' => $request->libelle,
                'agence_id' => $request->agence_id,
            ]);

            return response()->json([
                'message' => 'Le categorie a été ajouté avec succès',
                'categorie' => $categorie
            ], 200);

        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Une erreur est survenue lors de la création de la catégorie',
                'error' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur inattendue est survenue',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}


