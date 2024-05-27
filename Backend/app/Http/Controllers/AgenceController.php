<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Agence;

class AgenceController extends Controller
{
    public function store(Request $request)
    {
        try{
        $request->validate([
            'libelle' => 'required|string|max:255',
        ]);

        $agence = Agence::firstOrCreate([
            'libelle' => $request->libelle,
        ]);
        return response()->json(['message' => 'L\'Agence a été ajouté avec succès', 'agence' => $agence], 200);
    }
     catch (\Exception $e) {
            // Gérer les erreurs éventuelles
            return response()->json([
                'status' => 500,
                'message' => 'Une erreur est survenue lors de la récupération des Agences.',
            ], 500);
        }
}
}
