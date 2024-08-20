<?php

namespace App\Http\Controllers;

use App\Http\Resources\PrestataireResource;
use App\Models\Prestataire;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PrestataireController extends Controller
{
    public function index(Request $request,$index=null,$page=null)
    {
        $prestataire = Prestataire::where('etat',0)->paginate($index);
        return response()->json([
            'statut'=>Response::HTTP_OK,
            'message'=>'all permanents',
            'data'=>[
                'prestataires'=>PrestataireResource::collection($prestataire),
                'pagination'=>[
                    'taille'=>$prestataire->perPage(),
                    'page'=>$prestataire->currentPage(),
                    'total'=>$prestataire->total(),
                ]
            ]
        ]);
    }
}
