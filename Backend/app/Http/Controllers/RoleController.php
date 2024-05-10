<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function store(Request $request)
    {
        try {
        $request->validate([
            'libelle' => 'required|string|max:255',
        ]);

        $role = Role::create([
            'libelle' => $request->libelle,
        ]);

        return response()->json([
                "status" => 200,
                "message" => "Role ajouté avec succès",
                "data" => $role,
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
                "message" => "Erreur lors de l'ajout du role",
                "error" => $e->getMessage(),
            ], 500);
        }
}
}
