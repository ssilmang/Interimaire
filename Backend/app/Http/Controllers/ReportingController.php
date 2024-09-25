<?php

namespace App\Http\Controllers;

use App\Http\Resources\AnneeResource;
use App\Http\Resources\DirectionResource;
use App\Http\Resources\RoleResource;
use App\Models\Agence;
use App\Models\Annee;
use App\Models\Canal;
use App\Models\Categorie;
use App\Models\Categoriegroupe;
use App\Models\Contrat;
use App\Models\Departement;
use App\Models\Direction;
use App\Models\Groupe;
use App\Models\Interim;
use App\Models\Mois;
use App\Models\Permanent;
use App\Models\Pole;
use App\Models\Prestataire;
use App\Models\Service;
use App\Models\Statut;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ReportingController extends Controller
{
    protected $response;
    public function __construct(ResponseController $response)
    {
        $this->response = $response;
    }
    public function annee_mois()
    {
        $annes =Annee::all();
        $mois = Mois::all();
        
        $data = [
            "annee"=>AnneeResource::collection($annes),
            "mois"=>RoleResource::collection($mois),
        ];
        return $this->response->response(Response::HTTP_OK,'tous',$data);
    }
    public function reporting()
    {
        $statuts = Statut::all();
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
            // 'kangourou'=>0,
            'terminer'=>0,
        ];
        $kangourou =null;
        foreach ($statuts as $key => $statut) 
        {
            $effectStatutPerma = Permanent::where('statut_id',$statut->id)->first();
            $effectStatutPrest = Prestataire::where(['statut_id'=>$statut->id])->first();
            $effectStatutInter = Interim::where('statut_id',$statut->id)->first();
            if($effectStatutPerma)
            {
                $totalPermanent['en_cours'] += $effectStatutPerma->where(['etat'=>0])->count();
                $totalPermanent['terminer'] += $effectStatutPerma->where(['etat'=>1])->count();        
            }
            if($effectStatutPrest)
            {
                $totalPrestataire['en_cours'] += $effectStatutPrest->where(['etat'=>0])->count();
                $totalPrestataire['terminer'] += $effectStatutPrest->where(['etat'=>1])->count();
            }
            if($effectStatutInter)
            {
                $totalInterimaire['en_cours'] += $effectStatutInter->where('etat','en cours')->count();
                $totalInterimaire['rompre'] += $effectStatutInter->where('etat','rompre')->count();
                $totalInterimaire['terminer'] += $effectStatutInter->where('etat','terminer')->count();
                if($effectStatutInter){              
                    $contrat = Contrat::where(['interim_id'=>$effectStatutInter->id,'etat'=>[1,0]])->orderBy('date_debut_contrat','desc')->first();              
                    if($contrat)
                    {  
                        $kangou = Interim::find($effectStatutInter)->where('etat','remplacer')->first();
                        $duree =  $contrat->duree_contrat* 30 - $contrat->temps_presence_structure_actuel;
                        if($duree <= 60){
                            
                            if($kangou){
                                $kangourou = $kangou;
                                // $totalInterimaire['kangourou'] += $effectStatutInter->count();  
                            }
                        }
                    }
                }
            }
        }
        $effectifTotal=[
            'prestataire'=>$totalPrestataire,
            'interimaire'=>$totalInterimaire,
            'permanent'=>$totalPermanent
        ];
        return $this->response->response(Response::HTTP_OK,'all effectif',$effectifTotal);
    }
    public function getAgence()
    {
        $agences = Agence::all();
        $data =[];
        foreach ($agences as $key => $agence) 
        {
            $permant = Permanent::where('agence_id',$agence->id)->count();
            $prestataire = Prestataire::where('agence_id',$agence->id)->count();
            $interim =0;
            $categorie = Categorie::where('agence_id',$agence->id)->get()->pluck('id');
            if($categorie)
            {
                $interim += Interim::whereIn('categorie_id',$categorie)->whereIn('etat',['rompre','en cours','terminer'])->get()->count();
            }
            if(!isset($data[$agence->libelle]))
            {
                $data[$agence->libelle]= 0;
            }
            if(!isset($data[$agence->libelle]))
            {
                $data[$agence->libelle] = 0;
            }
            if(!isset($data[$agence->libelle]))
            {
                $data[$agence->libelle] = 0;
            }
            $data[$agence->libelle] += $prestataire;
            $data[$agence->libelle] += $permant;
            $data[$agence->libelle] += $interim;
        }
        return $this->response->response(Response::HTTP_OK,"all agence",[$data]);
    }
    public function getDRV()
    {
        $departements =Departement::all();
        $data =[];
        foreach ($departements as $key => $departement )
        {
            $permanents = Permanent::where('departement_id',$departement->id)->get();
            $prestataires = Prestataire::where('departement_id',$departement->id)->get();
            $interimaires = Interim::whereIn('responsable_id',$permanents->pluck('id'))->get();
            $data[$departement->libelle]["permanent"] = $permanents->count();
            $data[$departement->libelle]["prestataire"] = $prestataires->count();
            $data[$departement->libelle]["interimaire"] = $interimaires->count();
        }
       
        return $this->response->response(Response::HTTP_OK,'tous',$data);
    }
    public function getCanal()
    {
        $data=[ ];
        $dataRangs=[];
        $canals = Canal::all();
        $groupes = Groupe::all();
        foreach($canals as $canal)
        {
            $permanent = Permanent::where('canal_id',$canal->id)->get();
            $prestataire = Prestataire::where('canal_id',$canal->id)->count();
            $inerim = Interim::whereIn('responsable_id',$permanent->pluck('id'))
                                ->whereIn('etat',['rompre','en cours','terminer'])->get();
            $data[$canal->libelle]['permanent'] =+ $permanent->count(); 
            $data[$canal->libelle]['prestataire'] =+ $prestataire; 
            $data[$canal->libelle]['interimaire'] =+ $inerim->count();   
            foreach ($groupes as $key => $groupe) 
            {       
                if($canal->libelle)
                {
                    $permanentgroupe = Permanent::where('canal_id',$canal->id);
                    $prestatairegroupe = Prestataire::where(['canal_id'=>$canal->id,'groupe_id'=>$groupe->id])->count();
                    $interimgroupe = Interim::whereIn('responsable_id',$permanentgroupe->pluck('id'))
                                    ->where('groupe_id',$groupe->id)
                                    ->whereIn('etat', ['rompre', 'en cours', 'terminer'])
                                    ->count(); 
                    $dataRangs[$canal->libelle][$groupe->libelle]['permanent'] = $permanentgroupe->where('groupe_id',$groupe->id)->count();
                    $dataRangs[$canal->libelle][$groupe->libelle]['prestataire'] = $prestatairegroupe;
                    $dataRangs[$canal->libelle][$groupe->libelle]['interimaire'] = $interimgroupe;
                }              
            }
        } 
        $donnees = [
            'dataCanal'=>$data,
            'dataRang'=>$dataRangs,
        ];
        return $this->response->response(Response::HTTP_OK,'Tous les canals',$donnees);     
    }
    public function getCategorieGroupe()
    {
        $categories = Categoriegroupe::all();
        $data = [];;
        foreach ($categories as $key => $categorie) {
            $permanent = Permanent::where('categoriegroupe_id',$categorie->id)->get();
            $prestataire = Prestataire::where('categoriegroupe_id',$categorie->id)->get();
            $interim = Interim::where('categoriegroupe_id',$categorie->id)->whereIn('etat', ['rompre', 'en cours', 'terminer'])->get();
            $data[$categorie->libelle]['permanent']= +$permanent->count();
            $data[$categorie->libelle]['prestataire']= +$prestataire->count();
            $data[$categorie->libelle]['interimaire']= +$interim->count();
        }
        return $this->response->response(Response::HTTP_OK,'Categorie groupe recupérer',$data);
    }






}
