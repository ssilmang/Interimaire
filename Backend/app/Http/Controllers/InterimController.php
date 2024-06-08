<?php

namespace App\Http\Controllers;

use App\Http\Resources\InterimResource;
use App\Models\Categorie;
use App\Models\Contrat;
use App\Models\Image;
use App\Models\Interim;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class InterimController extends Controller
{
    public function index(Request $request)
    {
        
        try{
            $interim = Interim::all();
            return response()->json([
                'statut'=>Response::HTTP_OK,
                'message'=>'all interim',
                'data'=>[
                    "interimaires"=>InterimResource::collection($interim)
                ]
            ]);
        }catch(QueryException $e)
        {
            return response()->json([
                'statut'=>Response::HTTP_OK,
                'message'=>"all interim",
                'data'=>$e->getMessage(),
            ]);
        }
    }
    public function store(Request $request)
    {
        try{
            return DB::transaction(function() use($request){
                $request->validate([
                    'nom' => 'required|string',
                    'prenom' => 'required|string',
                    'matricule' => 'required|string|unique:interims,matricule',
                    'telephone' => ['required', 'string', 'regex:/^(70|77|76|75|78)\d{7}$/', 'unique:interims,telephone'],
                    'categorie_id' => 'required|exists:categories,id',
                    'responsable_id' => 'required|exists:responsables,id',
                    'poste_id' => 'required|exists:postes,id',
                ]);
                if (isset($request->categorie_id) && isset($request->responsable_id) && isset($request->poste_id)) {
                    $date_debut = Carbon::createFromFormat('d/m/Y',$request->debut_contrat);
                    $date_fin = Carbon::createFromFormat('d/m/Y',$request->fin_contrat);
                    $duree_contrat =( $date_debut->diffInMonths($date_fin));
                    $contrat = $duree_contrat + $request->temps_presence_autre_structure_sonatel;
                    if($contrat>24){
                        return response()->json([
                            "statut"=>Response::HTTP_BAD_REQUEST,
                            "message"=>"le contrat est supérieur à deux ans; invalide!!!",
                        ]);
                    }
                    $temps_presence_structure_actuel = 0;
                    $temps_presence_total = $request->temps_presence_autre_structure_sonatel;
                    $categorie = Categorie::where('id',$request->categorie_id)->first();  
                    $interim = new Interim();
                    $interim->nom= $request->nom;
                    $interim->prenom = $request->prenom;
                    $interim->matricule = $request->matricule;
                    $interim->telephone = $request->telephone;
                    $interim->avatar = $request->avatar;
                    $interim->categorie_id = $categorie->id;
                    $interim->responsable_id = $request->responsable_id;
                    $interim->poste_id = $request->poste_id;
                    if(!$interim->exists){
                        $interim->save();
                    }
                    $cout_mensuel = $categorie->cout_unitaire_journalier *30;
                    $cout_global = $cout_mensuel * $duree_contrat;
                    $contrat = Contrat::create([
                        'interim_id' => $interim->id,
                        'date_debut_contrat' => $request->debut_contrat,
                        'date_fin_contrat' => $request->fin_contrat,
                        'temps_presence_autre_structure_sonatel' => $request->temps_presence_autre_structure_sonatel,
                        'temps_presence_structure_actuel'=>$temps_presence_structure_actuel,
                        'cumul_presence_sonatel' => $temps_presence_total,
                        'duree_contrat' => $duree_contrat,
                        'duree_contrat_restant' => $duree_contrat,
                        'cout_mensuel' => $cout_mensuel,
                        'cout_global' => $cout_global,
                        'DA' => $request->DA?$request->DA:0,
                        'DA_kangurou' => $request->DA_kangurou?$request->DA_kangurou:0,
                        'commentaire' => $request->commentaire,
                    ]);
                    $message ="Contrat ajouter avec succès";
                    return response()->json([
                        'statut'=>Response::HTTP_OK,
                        'message'=>$message,
                        'data'=>$contrat,
                    ]);
                }
            });
        }catch(QueryException $e){
            return response()->json([
                'statut'=>Response::HTTP_NO_CONTENT,
                'message'=>'erreur lors du traitement',
                'data'=>$e->getMessage()
            ]);
        }
    }
    public function inserImage(Request $request){
        $interim = new Image();
        if($request->hasfile('photo')){
            $file = $request->file('photo');
            $extension = $file->getClientOriginalExtension();
            $filename = time().'.'. $extension;
            $file->move('uploads/higlights/',$filename);
            $interim->photo = $filename;
        }else{
            return $request;
            $interim->photo = '';
        }
         dd($request->photo);
        // $interim->save();
    }
    public function indexImage(Request $request){
        $imgages = Image::all();
        return view('image')->with('images',$imgages);
    }
}
