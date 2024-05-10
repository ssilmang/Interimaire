<?php

namespace App\Http\Controllers;

use App\Http\Resources\ResponsableResource;
use App\Models\Contrat;
use App\Models\Service;
use App\Models\Departement;
use App\Models\Direction;
use App\Models\interim;
use App\Models\Locau;
use App\Models\Pole;
use App\Models\Responsable;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
//     public function store(Request $request)
// {
//     try{
//         return DB::transaction(function() use($request){
//             $request->validate([
//                 'nom' => 'required|string',
//                 'prenom' => 'required|string',
//                 'email' => 'required|email|unique:users,email',
//                 'password' => 'required|string',
//                 'matricule' => 'required|string|unique:users,matricule',
//                 'role_id' => 'required|exists:roles,id',
//                 'telephone' => ['required', 'string', 'regex:/^(70|77|76|75|78)\d{7}$/', 'unique:users,telephone'],
//             ]);

//             $username = Str::slug($request->nom . '_' . $request->matricule, '_');

//             $user = User::create([
//                 'nom' => $request->nom,
//                 'prenom' => $request->prenom,
//                 'email' => $request->email,
//                 'password' => Hash::make($request->password),
//                 'matricule' => $request->matricule,
//                 'username' => $username,
//                 'role_id' => $request->role_id,
//                 'telephone' => $request->telephone,
//             ]);

//             // Vérifier si le rôle correspond à un responsable
//             $role = Role::findOrFail($request->role_id);
//             if ($role->libelle === "Responsable") {
//                 $request->validate([
//                     'locau_id' => 'required|exists:locaus,id',
//                     'pole_id'=>'required|exists:poles,id',
//                     'direction_id'=>'required|exists:directions,id',
//                     'departement_id' => 'required|exists:departements,id',
//                     'service_id' => 'required|exists:services,id',
//                 ]);

//                 // Vérifier les relations entre les entités
//                 $local = Locau::findOrFail($request->locau_id);
//                 $pole = Pole::findOrFail($request->pole_id);
//                 $direction = Direction::findOrFail($request->direction_id);
//                 $departement = Departement::findOrFail($request->departement_id);
//                 $service = Service::findOrFail($request->service_id);

//                 // Vérifier les associations entre les entités
//                 if ($pole->direction_id !== $direction->id) {
//                 return response()->json([
//                     "status" => 400,
//                     "message" => "Le pôle sélectionné n'appartient pas à la direction spécifiée."
//                 ], 400);
//             }

//             if ($departement->pole_id !== $pole->id) {
//                 return response()->json([
//                     "status" => 400,
//                     "message" => "Le département sélectionné n'appartient pas au pôle spécifié."
//                 ], 400);
//             }

//             if ($service->departement_id !== $departement->id) {
//                 return response()->json([
//                     "status" => 400,
//                     "message" => "Le service sélectionné n'appartient pas au département spécifié."
//                 ], 400);
//             }

//             if ($direction->locau_id !== $local->id) {
//                 return response()->json([
//                     "status" => 400,
//                     "message" => "Le département sélectionné n'appartient pas au local spécifié."
//                 ], 400);
//             }

//                 $user->save();

//                 Responsable::create([
//                     "user_id"=>$user->id,
//                     "departement_id"=>$departement->id,
//                     "service_id"=>$service->id,
//                 ]);

//                 return response()->json([
//                             "status" => 200,
//                             "message" => "Utilisateur ajouté avec succès",
//                             "data" => $user,
//                         ]);
//             }

//             $interim = Interim::create([
//                 'user_id' => $user->id,
//                 'categorie_id' => $request->categorie_id,
//                 'responsable_id' => $request->responsable_id,
//                 'poste_id' => $request->poste_id,
//             ]);

//             return response()->json([
//                 "status" => 200,
//                 "message" => "Intérim ajouté avec succès",
//                 "data" => $interim,
//             ]);
//         });

//         }catch(QueryException $e){
//             return response()->json([
//                 "statut"=>221,
//                 "message"=>"erreur",
//                 "data"=>$e->getMessage(),
//             ]);
//         }
//         }




public function store(Request $request)
{
    try {
        return DB::transaction(function() use($request) {
            $request->validate([
                'nom' => 'required|string',
                'prenom' => 'required|string',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string',
                'matricule' => 'required|string|unique:users,matricule',
                'telephone' => ['required', 'string', 'regex:/^(70|77|76|75|78)\d{7}$/', 'unique:users,telephone'],
                'role_id' => 'nullable|exists:roles,id',
            ]);

            $username = Str::slug($request->nom . '_' . $request->matricule, '_');

            $user = User::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'matricule' => $request->matricule,
                'username' => $username,
                'telephone' => $request->telephone,
                'role_id' => $request->role_id, // Peut être null pour un utilisateur simple
            ]);

            if ($request->has('role_id') && $request->role_id) {
                // Si un rôle est spécifié et qu'il ne s'agit pas d'un intérimaire
                $role = Role::findOrFail($request->role_id);
                if ($role->libelle === "Responsable") {
                    $request->validate([
                        'locau_id' => 'required|exists:locaus,id',
                        'pole_id'=>'required|exists:poles,id',
                        'direction_id'=>'required|exists:directions,id',
                        'departement_id' => 'required|exists:departements,id',
                        'service_id' => 'required|exists:services,id',
                    ]);

                    // Vérifier les relations entre les entités
                    $local = Locau::findOrFail($request->locau_id);
                    $pole = Pole::findOrFail($request->pole_id);
                    $direction = Direction::findOrFail($request->direction_id);
                    $departement = Departement::findOrFail($request->departement_id);
                    $service = Service::findOrFail($request->service_id);

                    // Vérifier les associations entre les entités
                    if ($pole->direction_id !== $direction->id) {
                        return response()->json([
                            "status" => 400,
                            "message" => "Le pôle sélectionné n'appartient pas à la direction spécifiée."
                        ], 400);
                    }

                    if ($departement->pole_id !== $pole->id) {
                        return response()->json([
                            "status" => 400,
                            "message" => "Le département sélectionné n'appartient pas au pôle spécifié."
                        ], 400);
                    }

                    if ($service->departement_id !== $departement->id) {
                        return response()->json([
                            "status" => 400,
                            "message" => "Le service sélectionné n'appartient pas au département spécifié."
                        ], 400);
                    }

                    if ($direction->locau_id !== $local->id) {
                        return response()->json([
                            "status" => 400,
                            "message" => "Le département sélectionné n'appartient pas au local spécifié."
                        ], 400);
                    }

                    $user->save();

                    Responsable::create([
                        "user_id"=>$user->id,
                        "departement_id"=>$departement->id,
                        "service_id"=>$service->id,
                    ]);

                    return response()->json([
                        "status" => 200,
                        "message" => "Utilisateur ajouté avec succès",
                        "data" => $user,
                    ]);
                }
            }

            // Validation pour un intérimaire
            if ($request->has('categorie_id') && $request->has('responsable_id') && $request->has('poste_id')) {
                $request->validate([
                    'categorie_id' => 'required|exists:categories,id',
                    'responsable_id' => 'required|exists:responsables,id',
                    'poste_id' => 'required|exists:postes,id',
                ]);

                $interim = interim::create([
                    'user_id' => $user->id,
                    'categorie_id' => $request->categorie_id,
                    'responsable_id' => $request->responsable_id,
                    'poste_id' => $request->poste_id,
                ]);


                $now = Carbon::now();
                $dureeContrat = 730; 
                $dateDebutContrat = $now->toDateString();
                $dateFinContrat = $now->copy()->addDays($dureeContrat)->toDateString();
                $dureeContratRestant = null;



                $contrat = Contrat::create([
                    'interim_id' => $interim->id,
                    'date_debut_contrat' => $dateDebutContrat,
                    'date_fin_contrat' => $dateFinContrat,
                    'temps_presence_structure_actuel' => $interim->temps_presence_structure_actuel ?? 0,
                    'temps_presence_autre_structure_sonatel' => $interim->temps_presence_autre_structure_sonatel ?? 0,
                    'cumul_presence_sonatel' => $interim->cumul_presence_sonatel ?? 0,
                    'duree_contrat' => $dureeContrat,
                    'duree_contrat_restant' => $dureeContratRestant,
                ]);

                return response()->json([
                    "status" => 200,
                    "message" => "Intérim ajouté avec succès",
                    "data" => $interim,
                    "contrat" => $contrat,
                ]);
            }

            return response()->json([
                "status" => 200,
                "message" => "Utilisateur ajouté avec succès",
                "data" => $user,
            ]);
        });
    } catch(QueryException $e) {
        return response()->json([
            "statut"=>221,
            "message"=>"erreur",
            "data"=>$e->getMessage(),
        ]);
    }
}





        public function GuetResponsable()
        {
            $responsable = Responsable::all();
            return response()->json([
                "statut"=>Response::HTTP_OK,
                "message"=>"all",
                "data"=>ResponsableResource::collection($responsable)

            ]);
        }
}


