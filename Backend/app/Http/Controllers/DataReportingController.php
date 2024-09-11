<?php

namespace App\Http\Controllers;

use App\Http\Resources\DataStatutResource;
use App\Models\Agence;
use App\Models\Annee;
use App\Models\AnneeMois;
use App\Models\Canal;
use App\Models\Categorie;
use App\Models\Categoriegroupe;
use App\Models\DataAgence;
use App\Models\DataCanal;
use App\Models\DataCategorie;
use App\Models\DataCommentaire;
use App\Models\DataDepartement;
use App\Models\DataGroupe;
use App\Models\DataStatut;
use App\Models\Departement;
use App\Models\Groupe;
use App\Models\Mois;
use App\Models\Statut;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class DataReportingController extends Controller
{
    public function store(Request $request,$annee,$mois)
    {
        try{
            return DB::transaction(function()use($request,$annee,$mois)
            {    
                $annee_actuel = Annee::firstOrCreate([
                    "libelle"=>$annee
                ]);
                $mois_actuel = Mois::where('libelle',$mois)->first();
                $annee_mois = AnneeMois::where(['annee_id'=>$annee_actuel->id,'mois_id'=>$mois_actuel->id])->first();
                foreach ($request->dataStatut as  $statut){
                    $stat = Statut::where('libelle',$statut['key'])->first();
                    DataStatut::updateOrCreate([
                        'statut_id'=>$stat->id,
                        'annee_mois_id'=>$annee_mois->id,
                    ],[
                        'libelle'=>$statut['value'],
                    ]);
                };
                foreach ($request->dataAgence as  $agence) {
                    $agen = Agence::where('libelle',$agence['key'])->first();
                    DataAgence::updateOrCreate([
                        'agence_id'=>$agen->id,
                        'annee_mois_id'=>$annee_mois->id,
                    ],[
                        'libelle'=>$agence['value'],
                    ]);
                };
                $data =[];
                foreach ($request->dataCategorie as  $key=>$categorie) {
                    $categ = Categoriegroupe::where('libelle',$categorie['key'])->first();
                    foreach ($categorie['value'] as  $value)
                    {
                        $statu = Statut::where('libelle',ucfirst($value['key']))->first();
                        DataCategorie::updateOrCreate([
                            'categoriegroupe_id'=>$categ->id,
                            'statut_id'=>$statu->id,
                            'annee_mois_id'=>$annee_mois->id,
                        ],
                        [
                            'libelle'=>$value['value'],
                        ]);
                    }
                }
                foreach ($request->dataDepartement as $key => $departement)
                {
                    $depart = Departement::where('libelle',$departement['key'])->first();
                    foreach($departement['value'] as $departem){
                        $sta = Statut::where('libelle',$departem['key'])->first();
                        DataDepartement::updateOrCreate([
                            'departement_id'=>$depart->id,
                            'statut_id'=>$sta->id,
                            'annee_mois_id'=>$annee_mois->id,
                        ],
                        [
                            'libelle'=>$departem['value'],
                        ]);
                    }
                }
                foreach($request->dataCanal as $canal)
                {
                    $can = Canal::where('libelle',$canal['key'])->first();
                    foreach($canal['value'] as $canVal)
                    {
                        $canStatut = Statut::where('libelle',$canVal['key'])->first();
                        $data_canal = DataCanal::updateOrCreate([
                            'canal_id'=>$can->id,
                            'statut_id'=>$canStatut->id,
                            'annee_mois_id'=>$annee_mois->id,
                        ],
                        [
                            'libelle'=>$canVal['value'],
                        ]);
                        foreach($canVal['dataGroupe'] as $groupe) 
                        {
                            $group = Groupe::where('libelle',$groupe['key'])->first();
                            DataGroupe::updateOrCreate([
                                'groupe_id'=> $group->id,
                                'data_canal_id'=>$data_canal->id,
                            ],[
                                'libelle'=>$groupe['value'],
                            ]);
                        }
                    }
                }
                DataCommentaire::updateOrCreate([
                    'annee_mois_id'=>$annee_mois->id,
                ],[
                    'commentaireStat'=>$request->dataCommentaire['commentaireStat'],
                    'commentaireAgenc'=>$request->dataCommentaire['commentaireAgenc'],
                    'commentaireCateg'=>$request->dataCommentaire['commentaireCateg'],
                    'commentaireDepartenement'=>$request->dataCommentaire['commentaireDepartement'],
                    'commentaireCan'=>$request->dataCommentaire['commentaireCan'],
                    'commentaireRang'=>$request->dataCommentaire['commentaireRang'],
                ]);
                return response()->json([
                    "statut"=>Response::HTTP_OK,
                    "message"=>"succes",
                    "data"=>"",
                ]);
            });
        }catch(QueryException $e){
            return response()->json([
                "statut"=>Response::HTTP_BAD_REQUEST,
                "message"=>"erreur",
                "data"=>$e->getMessage(),
            ]);
        }
    }
    public function index(Request $request,$annee,$mois){
        try{
            $data =[];
            $dataAgenc =[];
            $dataDepart =[];
            $dataCateg=[];
            $dataCan =[];
            $dataRang =[];
            $dataComment = [];
            $totalPermanent=[
                'en_cours'=>0,
                'terminer'=>0,
            ];
            $totalPrestataire=[
                'en_cours'=>0,
                'terminer'=>0,
            ];
            $totalInterimaire=[
                'en_cours'=>0,
                'rompre'=>0,
                'terminer'=>0,
            ];
        
            $annee_actuel = Annee::where('libelle',$annee)->first();
            $mois_actuel = Mois::find($mois);
            $annee_mois = AnneeMois::where(['annee_id'=>$annee_actuel->id,'mois_id'=>$mois_actuel->id])->first();
            $dataStatuts = DataStatut::where('annee_mois_id',$annee_mois->id)->get();
           $dataStatuts = DataStatutResource::collection($dataStatuts);
           $dataAgences = DataAgence::where('annee_mois_id',$annee_mois->id)->get();
           $dataCategorie = DataCategorie::where('annee_mois_id',$annee_mois->id)->get();
           $dataDepartements = DataDepartement::where('annee_mois_id',$annee_mois->id)->get();
           $dataCanal = DataCanal::where('annee_mois_id',$annee_mois->id)->get();
           $dataCommentaire = DataCommentaire::where('annee_mois_id',$annee_mois->id)->first();
           if($dataStatuts->isEmpty() || $dataAgences->isEmpty()  || $dataCategorie->isEmpty()  || $dataDepartements->isEmpty()  || $dataCanal->isEmpty()){
            return response()->json([
                "statut"=>Response::HTTP_BAD_REQUEST,
                "message"=>"errueur",
                "data"=>null,
            ]);
           }
            foreach ($dataStatuts as $key => $statut) {
                
                $explode = explode(',',$statut["libelle"]);
                if($statut['statut']['libelle']=="Permanent")
                {
                    $totalPermanent["en_cours"] +=(int)$explode[0];
                    $totalPermanent["terminer"] +=(int)$explode[2];
                }
                if($statut['statut']['libelle']=="Prestataire")
                {  
                    $totalPrestataire["en_cours"] +=(int)$explode[0];
                    $totalPrestataire["terminer"] +=(int)$explode[2];
                }
                if($statut['statut']['libelle']=="Interimaire")
                {
                    $totalInterimaire["en_cours"] +=(int)$explode[0];
                    $totalInterimaire["rompre"] +=(int)$explode[1];
                    $totalInterimaire["terminer"] +=(int)$explode[2];
                }
            }
            $data =[
                "permanent"=>$totalPermanent,
                "interimaire"=>$totalInterimaire,
                "prestataire"=>$totalPrestataire,
            ];
            foreach($dataAgences as $agence)
            {
                $ag = Agence::find($agence['agence_id']);
                if(!isset($dataAgenc[$ag['libelle']]))
                {
                    $dataAgenc[$ag['libelle']]= 0;
                }
                $dataAgenc[$ag['libelle']] += (int) $agence['libelle'];
            }
            foreach($dataCategorie as $categorie)
            {
                $categ = Categoriegroupe::find($categorie['categoriegroupe_id']);
                $sat = Statut::find($categorie['statut_id']);
                if(!isset($categorie[$categ['libelle']]))
                {
                    $dataCateg[$categ->libelle][strtolower($sat->libelle)] =0;
                }
                $dataCateg[$categ->libelle][strtolower($sat->libelle)] += $categorie['libelle'];
            }
            foreach($dataDepartements as $departement)
            {
                $depart = Departement::find($departement['departement_id']);
                $stat = Statut::find($departement['statut_id']);
                if(!isset($departement[$depart['libelle']]))
                {
                    $dataDepart[$depart['libelle']][strtolower($stat['libelle'])]= 0;
                }
                $dataDepart[$depart->libelle][strtolower($stat->libelle)] += $departement['libelle'];
            }
            foreach($dataCanal as $canal)
            {
                $can = Canal::find($canal['canal_id']);
                $st = Statut::find($canal['statut_id']);
                if(!isset($canal[$can['libelle']])){
                    $dataCan[$can->libelle][strtolower($st->libelle)] = 0;
                }
                $dataCan[$can->libelle][strtolower($st->libelle)] += $canal['libelle'];
                $datCan = DataCanal::where(['canal_id'=>$can->id,'statut_id'=>$st->id,'annee_mois_id'=>$annee_mois->id])->first();
                $dataRangs = DataGroupe::where('data_canal_id',$datCan->id)->get();
                foreach($dataRangs as $rang)
                {
                    $groupe = Groupe::find($rang['groupe_id']);
                    if(!isset($rang[$groupe['libelle']])){
                        $dataRang[$can['libelle']][$groupe->libelle][strtolower($st->libelle)] = 0;
                    }
                    $dataRang[$can['libelle']][$groupe->libelle][strtolower($st->libelle)] += $rang['libelle'];   
                }
            }
            $dataComment =[
                'commentaireStat'=>$dataCommentaire['commentaireStat'],
                'commentaireAgenc'=>$dataCommentaire['commentaireAgenc'],
                'commentaireCateg'=>$dataCommentaire['commentaireCateg'],
                'commentaireDepartenement'=>$dataCommentaire['commentaireDepartement'],
                'commentaireCan'=>$dataCommentaire['commentaireCan'],
                'commentaireRang'=>$dataCommentaire['commentaireRang'],
            ];
            $dataReporting =[
                "dataStatut"=>$data,
                "dataAgence"=>[$dataAgenc],
                "dataCategorie"=>$dataCateg,
                "dataDepartement"=>$dataDepart,
                "dataCanal"=>$dataCan,
                "dataRang"=>$dataRang,
                "dataCommentaire"=>$dataComment,
            ];
           
           
            return response()->json([
                "statut"=>Response::HTTP_OK,
                "message"=>"succès",
                "data"=>$dataReporting,
            ]);

        }catch(QueryException $e){
            return response()->json([
                "statut"=>Response::HTTP_BAD_REQUEST,
                "message"=>"erreur",
                "data"=>$e->getMessage(),
            ]);
        }
    }
}
