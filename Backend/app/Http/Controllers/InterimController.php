<?php

namespace App\Http\Controllers;

use App\Http\Resources\InterimResource;
use App\Models\Categorie;
use App\Models\Contrat;
use App\Models\Image;
use App\Models\Interim;
use App\Models\Poste;
use App\Models\Profile;
use App\Models\Remplacer;
use App\Models\Statut;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator ;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class InterimController extends Controller
{
    public $controller ;
    public function __construct(HeriteController $controller) 
    {
        $this->controller = $controller;
    }
    public function index(Request $request,$index=null,$page=null)
    {
        try{
            //  etat En cours
            //  ETAT ROMPRE
            //  ETAT TERMINER 
            $interim = Interim::whereIn('etat',['en cours','rompre'])->paginate($index);
            return response()->json([
                'statut'=>Response::HTTP_OK,
                'message'=>'all interim',
                'data'=>[
                    "interimaires"=>InterimResource::collection($interim),
                    "pagination"=>[
                        "page"=>$interim->currentPage(),
                        "taille"=>$interim->perPage(),
                        "total"=>$interim->total(),
                    ]
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
    public function finContrat(Request $request,$index=null,$page=null)
    {
        try{
            $interim = Interim::where('etat','terminer')->get();
            $idsInterim = [];
            foreach ($interim as $key => $value) {
                $contrat = Contrat::where(['interim_id'=>$value['id'],'etat'=>'-1'])->orderBy('date_debut_contrat')->first();
                if($contrat){
                    $idsInterim[] = $contrat->interim_id;
                }
            }
            $allInterim = Interim::whereIn('id',$idsInterim)->paginate($index);
            return response()->json([
                'statut'=>Response::HTTP_OK,
                'message'=>'all interim',
                'data'=>[
                    "interimaires"=>InterimResource::collection($allInterim),
                    "pagination"=>[
                        "page"=>$allInterim->currentPage(),
                        "taille"=>$allInterim->perPage(),
                        "total"=>$allInterim->total(),
                    ]
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
    public function store(Request $request,$statut,$profile)
    {
        try{
            return DB::transaction(function() use($request,$statut,$profile)
            {
                Validator::make($request->all(),[
                    'categorieInterim' => 'required|exists:categories,id',
                    'responsable' => 'required|exists:permanents,id',
                    'poste' => 'required',
                ])->validate();   
                if(!is_numeric($request->poste) && $request->poste != null)
                {
                    $poste = Poste::firstOrCreate([
                        'libelle'=>$request->poste,
                        'duree_kangurou'=>$request->duree_kangourou?$request->duree_kangourou:0,
                        'montant_kangurou'=>$request->montant_kangourou?$request->montant_kangourou:0
                    ]);
                }else
                {
                    $poste = Poste::find($request->poste);
                }
                if (isset($request->categorieInterim) && isset($request->responsable) && isset($request->poste))
                {
                    $date_debut = Carbon::createFromFormat('Y-m-d',$request->date_debut_contrat);
                    $date_fin = Carbon::createFromFormat('Y-m-d',$request->date_fin_contrat);
                    $duree_contrat =( $date_debut->diffInMonths($date_fin));
                    $contrat = $duree_contrat + $request->temps_presence_autre_structure_sonatel;
                    if($contrat>24)
                    {
                        return response()->json([
                            "statut"=>Response::HTTP_BAD_REQUEST,
                            "message"=>"le contrat est supérieur à deux ans; invalide!!!",
                            ]);
                    }
                    $temps_presence_structure_actuel = 0;
                    $temps_presence_total = $request->temps_presence_autre_structure_sonatel;
                    $categorie = Categorie::where('id',$request->categorieInterim)->first();  
                    $interim = new Interim();
                    $interim->statut_id = $statut['id'];
                    $interim->profile_id = $profile->id;
                    $interim->categorie_id = $categorie->id;
                    $interim->responsable_id = $request->responsable;
                    $interim->poste_id = $poste->id;
                    $interim->save();
                    $message ="Contrat ajouter avec succès";        
                    $cout_mensuel = $categorie->cout_unitaire_journalier *30;
                    $cout_global = $cout_mensuel * $duree_contrat;
                    $contrat = Contrat::createOrUpdate([
                        'interim_id' => $interim->id,
                        'date_debut_contrat' => $request->date_debut_contrat,
                        'date_fin_contrat' => $request->date_fin_contrat,
                        'temps_presence_autre_structure_sonatel' => $request->temps_presence_autre_structure_sonatel,
                        'temps_presence_structure_actuel'=>$temps_presence_structure_actuel,
                        'cumul_presence_sonatel' => $temps_presence_total,
                        'duree_contrat' => $duree_contrat,
                        'duree_contrat_restant' => $duree_contrat,
                        'cout_mensuel' => $cout_mensuel,
                        'cout_global' => $cout_global,
                        'DA' => $request->DA?$request->DA:0,
                        'DA_kangurou' => $request->DA_kangourou?$request->DA_kangourou:0,
                        'commentaire' => $request->commentaire,
                    ]);
                    return response()->json([
                        'statut'=>Response::HTTP_OK,
                        'message'=>$message,
                        'data'=>$contrat,
                    ]);
                }
            });
        }catch(QueryException $e)
        {
            return response()->json([
                'statut'=>Response::HTTP_NO_CONTENT,
                'message'=>'erreur lors du traitement',
                'data'=>$e->getMessage()
            ]);
        }
    }
    public function update(Request $request,$id,$statut,$profile,$contrat_id)
    {
        try{
            return DB::transaction(function() use($request,$id,$statut,$profile,$contrat_id){
               $interim = Interim::find($id);
                
                $poste = $this->controller->store($request->poste,"Poste","Poste");
                if (isset($request->categorieInterim) && isset($request->responsable) && isset($request->poste)) {
                    $date_debut = Carbon::createFromFormat('Y-m-d',$request->date_debut_contrat);
                    $date_fin = Carbon::createFromFormat('Y-m-d',$request->date_fin_contrat);
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
                            $categorie = Categorie::where('id',$request->categorieInterim)->first();  
                               
                    $interim->statut_id = $statut->id;
                    $interim->profile_id = $profile->id;
                    $interim->categorie_id = $categorie->id;
                    $interim->responsable_id = $request->responsable;
                    $interim->poste_id = $poste->id;  
                    $interim->save();
                    $message ="Contrat mise en jour avec succès";
                    $cout_mensuel = $categorie->cout_unitaire_journalier *30;
                    $cout_global = $cout_mensuel * $duree_contrat;
                    $contratUpdate = Contrat::findOrFail($contrat_id);
                    $contratUpdate->interim_id = $interim->id;
                    $contratUpdate->date_debut_contrat = $request->date_debut_contrat;
                    $contratUpdate ->date_fin_contrat = $request->date_fin_contrat;
                    $contratUpdate->temps_presence_autre_structure_sonatel = $request->temps_presence_autre_structure_sonatel;
                    $contratUpdate->temps_presence_structure_actuel=$temps_presence_structure_actuel;
                    $contratUpdate->cumul_presence_sonatel = $temps_presence_total;
                    $contratUpdate->duree_contrat = $duree_contrat;
                    $contratUpdate->duree_contrat_restant = $duree_contrat;
                    $contratUpdate->cout_mensuel = $cout_mensuel;
                    $contratUpdate->cout_global = $cout_global;
                    $contratUpdate->DA= $request->DA?$request->DA:0;
                    $contratUpdate->DA_kangurou = $request->DA_kangourou?$request->DA_kangourou:0;
                    $contratUpdate ->commentaire = $request->commentaire;
                    $contratUpdate->save();
                   
                    return response()->json([
                        'statut'=>Response::HTTP_OK,
                        'message'=>$message,
                        'data'=>$contratUpdate,
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
    public function editeCommentaire(Request $request, $id)
    {
        if($id)
        {
            $profile = Profile::find($id);
            $profile->update(['commentaire'=>$request->commentaire]);
          return  $this->controller->responseController->response(Response::HTTP_OK,"commentaire mise en jour avec succès",$profile);
        }
    }
    public function rompreAnnuler(Request $request,$id)
    {
        if($id)
        {
            $inter = Interim::findOrFail($id);
            $contrats = Contrat::where(['interim_id'=>$inter->id])->whereIn('etat',[0,1,-1])->orderBy('date_debut_contrat','desc')->first();           
                if($request->date > $contrats['date_debut_contrat'] && $request->date < $contrats['date_fin_contrat']){                                  
                    if($contrats["etat"] === 0)
                    { 
                       return  DB::transaction(function() use($request,$contrats,$inter)
                       {
                             Interim::where('id',$inter->id)->update([
                                'etat'=>'rompre',
                            ]);
                            Contrat::where('id',$contrats['id'])->update([
                                'etat'=>1,
                                'date'=>$request->date,
                                'motif'=>$request->motif
                            ]);
                            $interim = Interim::findOrFail($inter->id);
                            return  $this->controller->responseController->response(Response::HTTP_OK,"le contrat à été rompu avec succès",InterimResource::make($interim)); 
                        });                                         
                    }elseif($contrats['etat'] === 1)
                    {                    
                       return DB::transaction(function() use($request,$contrats,$inter)
                       {
                           Interim::where('id',$inter['id'])->update([
                               'etat'=>'en cours',
                           ]);
                           $date_debut = Carbon::createFromFormat('Y-m-d',$request->date);
                           $date_fin = Carbon::createFromFormat('Y-m-d',$contrats['date_fin_contrat']);
                           $duree_contrat =( $date_debut->diffInMonths($date_fin));
                           $contrat = new Contrat();            
                           $contrat->fill($contrats->toArray());
                           $contrat->date_debut_contrat = $request->date;
                           $contrat->temps_presence_structure_actuel = $contrats['temps_presence_structure_actuel'];
                           $contrat->duree_contrat_restant = $duree_contrat;
                           $contrat->etat = 0;
                           $contrat->date = null;
                           $contrat->motif = null;
                           $contrat->save();
                           $interim = Interim::findOrFail($inter->id);
                           return  $this->controller->responseController->response(Response::HTTP_OK,"le contrat à été renouveler avec succès",InterimResource::make($interim));
                        });
                    }
                }else
                {
                    if($request->date_fin && $request->date_debut){
                        return DB::transaction(function() use($request,$contrats,$inter)
                        {
                            Interim::where('id',$inter->id)->update([
                               'etat'=>'en cours',
                           ]);
                           $contrat = new Contrat();
                           $contrat ->fill($contrats->toArray());
                           $contrat->date_debut_contrat = $request->date_debut;
                           $contrat->date_fin_contrat = $request->date_fin;
                           $contrat->etat=0;
                           $contrat->date= null;
                           $contrat->motif = null;
                           $contrat->save();
                           $interim = Interim::findOrFail($inter->id);
                           return  $this->controller->responseController->response(Response::HTTP_OK,"le contrat à été signer avec succès",InterimResource::make($interim));
                        });
                    }
                }
                return  $this->controller->responseController->response(Response::HTTP_OK,"La date doit compris entre la date debut et la date de fin ",InterimResource::make($inter));
        }

    } 
    public function processusKangourou(Request $request,$index=null,$page=null)
    {
        $interims = Interim::all();
        $dataInterims = [];
        foreach($interims as $interim)
        {
            $contrat = Contrat::where(['interim_id'=>$interim['id'],'etat'=>0])->orderBy('date_debut_contrat','desc')->first();
           if($contrat)
           {
                $duree =  $contrat->duree_contrat* 30 - $contrat->temps_presence_structure_actuel;
                if($duree <= 60)
                {
                    $dataInterims[]=$interim['id'];
                }
           }
        }
        $interimaires = Interim::whereIn('id',$dataInterims)->paginate($index);
        return response()->json([
            'statut'=>Response::HTTP_OK,
            'message'=>'all interim',
            'data'=>[
                "interimaires"=>InterimResource::collection($interimaires),
                "pagination"=>[
                        "page"=>$interimaires->currentPage(),
                        "taille"=>$interimaires->perPage(),
                        "total"=>$interimaires->total(),
                    ]
            ]
        ]);
    }
    public function remplacement(Request $request,$user)
    {
        try{
            return DB::transaction(function() use($request,$user)
            {
                $userProfile = Profile::find($user);
                if($userProfile)
                {
                    $interimaire = Interim::where('profile_id',$userProfile->id)->first();
                    if($interimaire->etat==="en cours")
                    {
                        $contrat = Contrat::where('interim_id',$interimaire->id)->where('etat',0)->orderBy('date_debut_contrat','desc')->first();
                        if($contrat)
                        {
                            $processus = $contrat->duree_contrat* 30 - $contrat->temps_presence_structure_actuel;
                            $photo = null;
                            if($processus <= 60){
                                if($request->hasfile('photo'))
                                {
                                    $file = $request->file('photo');
                                    $extension = $file->getClientOriginalExtension();
                                    $filename = time().'.'. $extension;
                                    $photo = $filename;
                                    $file->move('uploads/Interims/',$filename);
                                }
                                $profile =  $this->controller->UserProfile($request,$photo);
                                $statut = Statut::find($interimaire->statut_id);
                                $int = $this->store($request,$statut,$profile);
                                if($int)
                                {
                                    Interim::find($interimaire->id)->update(['etat'=>'remplacer']);
                                    $remplace = Remplacer::create([
                                        'remplacer_id'=>$userProfile->id,
                                        'remplacant'=>$profile->id,
                                    ]);
                                    return $this->controller->responseController->response(Response::HTTP_OK,'Vous avez remplacer l\'interimaire avec succès',$remplace);
                                }
                            }
                            return $this->controller->responseController->response(Response::HTTP_ACCEPTED,'il n\'est pas dans le processus de kangourou',$interimaire); 
                        }
                        return $this->controller->responseController->response(Response::HTTP_ACCEPTED,'cet interimaire n\'a pas de contrat qu\'on peut remplacer',$interimaire);
                    }else{
                        return $this->controller->responseController->response(Response::HTTP_ACCEPTED,'cette interim est iremplacable car son contrat est en cours',$interimaire);
                    }         
                }
                return $this->controller->responseController->response(Response::HTTP_ACCEPTED,'l\'interimaire n\'existe pas',"" );
            });

        }catch(QueryException $e)
        {
            $this->controller->responseController->response(Response::HTTP_BAD_REQUEST,"erreur lors du traitement",$e);
        }
    }
}
