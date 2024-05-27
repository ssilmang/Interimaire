<?php

namespace App\Http\Controllers;

use App\Http\Resources\ResponsableResource;
use App\Models\AgenceCommercial;
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
public function store(Request $request)
{
    try {
        return DB::transaction(function() use($request) {
            $request->validate([
                'nom' => 'required|string',
                'prenom' => 'required|string',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|max:6',
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
                'role_id' => $request->role_id, 
            ]);
            $message="utilisateur ajouter avec succès";
           
            if ($request->has('role_id') && $request->role_id) {
                $role = Role::findOrFail($request->role_id);
                if ($role->libelle === "Responsable") {
                    $request->validate([
                        'departement_id' => 'required|exists:departements,id',
                        'service_id' => 'exists:services,id',
                    ]);
                    $departement = Departement::findOrFail($request->departement_id);
                    $service = 0;
                    $agence_commercial = 0;
                    if(isset($request->service_id)&& $request->service_id){
                        $service = Service::findOrFail($request->service_id);
                            if ($service->departement_id !== $departement->id) {
                            return response()->json([
                                "status" => 400,
                                "message" => "Le service sélectionné n'appartient pas au département spécifié."
                            ], 400);
                        }
                    }
                    if(isset($request->agence_commercial_id)&& $request->agence_commercial_id){
                        $agence_commercial= AgenceCommercial::findOrFail($request->agence_commercial_id);
                        if ($agence_commercial->departement_id !== $departement->id) {
                            return response()->json([
                                "status" => 400,
                                "message" => "Le service sélectionné n'appartient pas au département spécifié."
                            ], 400);
                        }
                    }               
                    $message="responsable existe déjà";
                    $responsable = new Responsable();
                    $responsable->user_id = $user->id;
                    $responsable->departement_id = $departement->id;
                    $responsable->service_id = $request->service_id? $service->id:$service;
                    $responsable->agencecommercial_id=$request->agence_commercial_id?$agence_commercial->id:$agence_commercial;              
                    if(!$responsable->exists){
                        $responsable->save();
                        $message = "Responsable ajouté avec succès ";
                    }
                }
            }
            return response()->json([
                "status" => 200,
                "message" => $message,
                "data" => $user,
            ]);
        });
    } catch (QueryException $e) {
        return response()->json([
            "status" => 221,
            "message" => "erreur",
            "data" => $e->getMessage(),
        ]);
    }
}
public function getResponsable(Request $request)
{
    $responsable = Responsable::all();
    return response()->json([
        "statut"=>Response::HTTP_OK,
        "message"=>"all",
        "data"=>ResponsableResource::collection($responsable)

    ]);
}
}


