<?php

namespace App\Http\Controllers;

use App\Http\Resources\ContratResource;
use App\Models\Contrat;
use App\Models\interim;
use Illuminate\Http\Request;

class ContratController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
        // Récupérer tous les contrats avec les informations associées
        $contrats = Contrat::with(['user', 'poste', 'responsable', 'agence', 'categorie'])->get();



        // Retourner les contrats formatés sous forme de réponse JSON
        return response()->json([
            'statut' => 200,
            'message'=>"dff",
            'data' =>[
                'Interim'=>ContratResource::collection($contrats)
            ]
        ]);
    } catch (\Exception $e) {
        // Gérer les erreurs éventuelles
        return response()->json([
            'status' => 500,
            'message' => 'Une erreur est survenue lors de la récupération des contrats.',
            'error' => $e->getMessage(),
        ], 500);
    }
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
//     public function store(Request $request)
// {
//     try {
//         $request->validate([
//             'iterim_id' => 'required|exists:iterims,id',
//             'date_debut_contrat' => 'required|date',
//             'date_fin_contrat' => 'nullable|date',
//             'temps_presence_structure_actuel' => 'nullable|integer',
//             'temps_presence_autre_structure_sonatel' => 'nullable|integer',
//             'cumul_presence_sonatel' => 'nullable|integer',
//             'duree_contrat' => 'nullable|integer',
//             'duree_contrat_restant' => 'nullable|integer',
//             'cout_mensuel' => 'nullable|numeric',
//             'cout_global' => 'nullable|numeric',
//             'DA' => 'nullable|numeric',
//             'DA_kangurou' => 'nullable|numeric',
//             'commentaire' => 'nullable|string',
//             'etat' => 'nullable|string',
//         ]);

//         $contrat = Contrat::create([
//             'iterim_id' => $request->iterim_id,
//             'date_debut_contrat' => $request->date_debut_contrat,
//             'date_fin_contrat' => $request->date_fin_contrat,
//             'temps_presence_structure_actuel' => $request->temps_presence_structure_actuel,
//             'temps_presence_autre_structure_sonatel' => $request->temps_presence_autre_structure_sonatel,
//             'cumul_presence_sonatel' => $request->cumul_presence_sonatel,
//             'duree_contrat' => $request->duree_contrat,
//             'duree_contrat_restant' => $request->duree_contrat_restant,
//             'cout_mensuel' => $request->cout_mensuel,
//             'cout_global' => $request->cout_global,
//             'DA' => $request->DA,
//             'DA_kangurou' => $request->DA_kangurou,
//             'commentaire' => $request->commentaire,
//             'etat' => $request->etat,
//         ]);

//         return response()->json([
//             'status' => 'success',
//             'message' => 'Contrat created successfully.',
//             'data' => $contrat,
//         ], 201);
//     } catch (\Exception $e) {
//         return response()->json([
//             'status' => 'error',
//             'message' => 'Failed to create contrat.',
//             'error' => $e->getMessage(),
//         ], 500);
//     }
// }


public function store(Request $request)
{
    try {
        $request->validate([
            'interim_id' => 'required|exists:interims,id',
            'date_debut_contrat' => 'required|date',
            'date_fin_contrat' => 'nullable|date',
            'temps_presence_structure_actuel' => 'nullable|integer',
            'temps_presence_autre_structure_sonatel' => 'nullable|integer',
            'cumul_presence_sonatel' => 'nullable|integer',
            'duree_contrat' => 'nullable|integer',
            'duree_contrat_restant' => 'nullable|integer',
            'cout_mensuel' => 'nullable|numeric',
            'cout_global' => 'nullable|numeric',
            'DA' => 'nullable|numeric',
            'DA_kangurou' => 'nullable|numeric',
            'commentaire' => 'nullable|string',
            'etat' => 'nullable|string',
        ]);

        // Trouver l'interim en fonction de son ID
        $interim = Interim::findOrFail($request->interim_id);

        // Calculer la durée du contrat par défaut (2 ans)
        $defaultContractDuration = 2 * 12;

        // Utiliser la durée de contrat fournie, sinon utiliser la durée par défaut
        $contractDuration = $request->filled('duree_contrat') ? $request->duree_contrat : $defaultContractDuration;

        // Utiliser la durée de contrat restante de l'interim s'il existe, sinon utiliser la durée fournie
        $remainingContractDuration = $interim->duree_contrat_restant ?? $contractDuration;

        // Utiliser le temps de présence actuel de l'interim s'il existe, sinon utiliser 0
        $currentPresenceTime = $request->filled('temps_presence_structure_actuel') ? $request->temps_presence_structure_actuel : ($interim->temps_presence_structure_actuel ?? 0);

        // Si l'interim a une présence dans une autre structure Sonatel, l'utiliser pour calculer la présence totale dans Sonatel
        if ($interim->temps_presence_autre_structure_sonatel > 0) {
            $otherStructurePresenceTime = $interim->temps_presence_autre_structure_sonatel;
            $totalSonatelPresenceTime = $otherStructurePresenceTime;
        } else {
            $otherStructurePresenceTime = 0;
            $totalSonatelPresenceTime = 0;
        }

        // Calculer le temps de présence total
        $totalPresenceTime = $currentPresenceTime + $otherStructurePresenceTime;

        // Si la durée du contrat fournie est supérieure à la durée restante, mettre à jour la durée restante
        if ($contractDuration > $remainingContractDuration) {
            $remainingContractDuration = $contractDuration;
        }

        // Créer le contrat avec les valeurs calculées et/ou fournies
        $contrat = Contrat::create([
            'interim_id' => $interim->id,
            'date_debut_contrat' => $request->date_debut_contrat,
            'date_fin_contrat' => $request->date_fin_contrat,
            'temps_presence_structure_actuel' => $currentPresenceTime,
            'temps_presence_autre_structure_sonatel' => $otherStructurePresenceTime,
            'cumul_presence_sonatel' => $totalSonatelPresenceTime,
            'duree_contrat' => $contractDuration,
            'duree_contrat_restant' => $remainingContractDuration,
            'cout_mensuel' => $request->cout_mensuel,
            'cout_global' => $request->cout_global,
            'DA' => $request->DA,
            'DA_kangurou' => $request->DA_kangurou,
            'commentaire' => $request->commentaire,
            'etat' => $request->etat,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Contrat créé avec succès.',
            'data' => $contrat,
            'contrat'=>$contrat,
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Échec de la création du contrat.',
            'error' => $e->getMessage(),
        ], 500);
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
