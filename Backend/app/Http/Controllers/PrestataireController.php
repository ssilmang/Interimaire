<?php

namespace App\Http\Controllers;

use App\Http\Resources\PrestataireResource;
use App\Models\Prestataire;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PrestataireController extends Controller
{
    public function index()
    {
        $prestataire = Prestataire::all();
        return response()->json([
            'statut'=>Response::HTTP_OK,
            'message'=>'all permanents',
            'data'=>PrestataireResource::collection($prestataire)
        ]);
    }
}
