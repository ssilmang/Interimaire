<?php

namespace App\Http\Controllers;

use App\Models\Annee;
use App\Models\AnneeMois;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnneeController extends Controller
{
    protected $herite;
    public function __construct(HeriteController $herite)
    {
        $this->herite = $herite;
    }
    public function store(Request $request)
    {
        return DB::transaction(function() use($request){
            $annee = Annee::firstOrCreate([
                "libelle"=>$request->annee,
            ]);
            $mois = $this->herite->store($request->mois,'Mois','');
            $annee_mois = AnneeMois::firstOrCreate([
                'mois_id'=>$mois->id,
                'annee_id'=>$annee->id,
            ]);
            return response()->json([
                "statut"=>200,
                'message'=>'ajout avec succès',
                'data'=>$annee_mois
            ]);
        });
    }
}
