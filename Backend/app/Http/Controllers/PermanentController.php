<?php

namespace App\Http\Controllers;

use App\Http\Resources\PermanentResource;
use App\Http\Resources\RemplacementResource;
use App\Models\Agence;
use App\Models\AgenceCommercial;
use App\Models\Categorie;
use App\Models\Contrat;
use App\Models\Direction;
use App\Models\Interim;
use App\Models\Permanent;
use App\Models\PermanentOfRemplace;
use App\Models\Poste;
use App\Models\Prestataire;
use App\Models\Profile;
use App\Models\Remplacer;
use App\Models\RemplacerPermanent;
use Carbon\Carbon;
use Faker\Provider\ar_EG\Person;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Rap2hpoutre\FastExcel\FastExcel;
use Symfony\Component\HttpFoundation\Response;

class PermanentController extends Controller
{
    public $response ,$controller, $interimaire;
    public function __construct(ResponseController $response,HeriteController $controller,InterimController $interimaire)
    {
        $this->response = $response;
        $this->controller = $controller;
        $this->interimaire = $interimaire;
    }
    public function index(Request $request, $id,$index=null,$page=null)
    {
        $permanents = Permanent::with(['profile', 'poste', 'canal', 'statut', 'groupe', 'categoriegroupe', 'agence', 'direction', 'locau', 'pole', 'departement', 'service', 'agence_commercial', 'responsable'])
        ->findOrFail($id);
        $collaborateurs = $permanents->collaborateurs()->whereIn('etat',[0,2])->paginate($index);
        return response()->json([
            'statut'=>Response::HTTP_OK,
            'message'=>'all permanents',
            'data'=>[
                'permanent'=> PermanentResource::make($permanents),
                'collaborateurs' => PermanentResource::collection($collaborateurs->items()),
                'pagination'=>[
                    'total' => $collaborateurs->total(),
                    'taille' => $collaborateurs->perPage(),
                    'page' => $collaborateurs->currentPage(),
                    'derniere_page' => $collaborateurs->lastPage(),
                ],
            ],
        ]);
    }
    public function getPermanent()
    {
        $poste = Poste::where('libelle','Directeur des ventes')->first();
        $direction = Direction::where('libelle','DV')->first();
        $permanent = Permanent::where(['poste_id'=>$poste->id,'direction_id'=>$direction->id,'etat'=>0])->first();
        $data =["dvs"=>PermanentResource::make($permanent)];    
        return $this->response->response(Response::HTTP_OK,'index permanent dv',$data);
    }
    public function store(Request $request,$id = 0,$idProfile = 0,$upload = "null",$contrat_id = 0,$remplacer = 0)
    {      
        try{
            return DB::transaction(function() use($request,$id,$idProfile,$upload,$contrat_id,$remplacer)
            {     
                $valide = $request->validate([
                    'statut'=>'required',
                    'groupe'=>'required',
                    'categorie'=>'required',
                ]);
                $file ="";
                $photo = '';
                $profile=0;
                $idInterim =  Interim::find($id);
                $idPermanent = Permanent::find($id);
                $idPrestataire = Prestataire::find($id);
                $groupe = $this->controller->store($request->groupe,"Groupe","Groupe");
                $categorie = $this->controller->store($request->categorie,"Categoriegroupe","Categorie de groupe");
                if($upload == "null"){
                    if($request->hasfile('photo'))
                    {
                        $file = $request->file('photo');
                        $extension = $file->getClientOriginalExtension();
                        $filename = time().'.'. $extension;
                        $photo = $filename;
                    }
                }else{
                    $photo=$request->photo;
                }
                $statut = $this->controller->store($request->statut,"Statut","statut");
                if($idProfile == 0){
                    $profile =  $this->controller->UserProfile($request,$photo);
                }else{
                    $profile = $this->controller->updateUserProfile($request,$photo,$idProfile);
                }    
               if(strtolower($statut->libelle) === strtolower("Interimaire"))
               {
                    if($upload == "null")
                    {
                        $file->move('uploads/Interims/',$filename);
                    }
                    if($id!=0)
                    {
                        $int= $this->interimaire->update($request,$id,$statut,$profile,$contrat_id,$categorie,$groupe);
                        return $int;
                    }else{
                        $interim =$this->interimaire->store($request,$statut,$profile,$categorie,$groupe);
                    return $interim;
                    }
               }else
               {
                   $validate = $request->validate([
                       'poste'=>'required',
                       'canal'=>'required',
                       'agence'=>'required',
                       'statut'=>'required',
                    ]);
                    $canal = $this->controller->store($request->canal,"Canal","Canal");
                    $agence = $this->controller->store($request->agence,"Agence","Agence");  
                    $poste = $this->controller->store($request->poste,"Poste","Poste");
                    $locau = $this->controller->store($request->locau,"Locau","locau");         
                    $service = 0; $direction = 0; $pole = 0; $departement = 0; $commercial =0;          
                    if(isset($request->direction) && $request->direction!= "null")
                    {
                        $direction = $this->controller->store($request->direction,"Direction","direction");
                    }
                    if(isset($request->pole) && $request->pole !="null" )
                    {
                        $pole = $this->controller->create($request->pole,'direction_id',$direction->id,"Pole","pole");
                    }
                    if(isset($request->departement) && $request->departement!=="null")
                    {
                        $departement = $this->controller->create($request->departement,'pole_id',$pole->id,"Departement","departement");
                    }
                    if(isset($request->service) && $request->service!=="null" )
                    {
                        $service = $this->controller->create($request->service,'departement_id',$departement->id,"Service","service");
                        
                    }
                    if(isset($request->agence_commercial) && $request->agence_commercial !== "null" )
                    {
                        $commercial = $this->controller->create($request->agence_commercial,'departement_id',$departement->id,"AgenceCommercial","agenceCommercial");
                    }
                    if(strtolower($statut->libelle) === strtolower("Prestataire"))
                    {
                        if($upload == "null")
                        {
                            $file->move('uploads/prestataire/',$filename);
                        }
                       if($id!=0)
                       {
                            $idPrestataire->profile_id=$profile->id;
                            $idPrestataire->poste_id=$poste->id;
                            $idPrestataire->canal_id=$canal->id;
                            $idPrestataire->statut_id=$statut->id;
                            $idPrestataire->groupe_id=$groupe->id;
                            $idPrestataire->locau_id=$locau->id;
                            $idPrestataire->categoriegroupe_id=$categorie->id;
                            $idPrestataire->agence_id=$agence->id;
                            $idPrestataire->direction_id=$direction->id;
                            $idPrestataire->pole_id=$pole? $pole->id : null;
                            $idPrestataire->departement_id=$departement? $departement->id :null;
                            $idPrestataire->service_id=$service? $service->id : null;
                            $idPrestataire->agence_commercial_id=$commercial?$commercial->id:null;
                            $idPrestataire->responsable_id=$request->responsable;
                            $idPrestataire->save();
                        return $this->response->response(Response::HTTP_OK,"Prestataire mise en jour avec succès",$idPrestataire);
                       }
                       else{
                       
                        $prestataire = new Prestataire();
                        $prestataire->profile_id=$profile->id;
                        $prestataire->poste_id=$poste->id;
                        $prestataire->canal_id=$canal->id;
                        $prestataire->statut_id=$statut->id;
                        $prestataire->groupe_id=$groupe->id;
                        $prestataire->locau_id=$locau->id;
                        $prestataire->categoriegroupe_id=$categorie->id;
                        $prestataire->agence_id=$agence->id;
                        $prestataire->direction_id=$direction->id;
                        $prestataire->pole_id=$pole? $pole->id : null;
                        $prestataire->departement_id=$departement? $departement->id :null;
                        $prestataire->service_id=$service? $service->id : null;
                        $prestataire->agence_commercial_id=$commercial?$commercial->id:null;
                        $prestataire->responsable_id=$request->responsable;
                        if(!$prestataire->exists){
                            $prestataire->save();
                        }
                        return $this->response->response(Response::HTTP_OK,"prestataire ajouter avec succès",$prestataire);
                       }
                    }elseif(strtolower($statut->libelle) === strtolower("Permanent"))
                    {
                        $message = "";
                        if($upload === "null")
                        {
                            $file->move('uploads/higlights/',$filename);
                        }
                        if($id!= 0)
                        {                  
                            $permanent = Permanent::find($id);
                           
                            $permanent->profile_id=$profile->id;
                            $permanent->poste_id=$poste->id;
                            $permanent->canal_id=$canal->id;
                            $permanent->statut_id=$statut->id;
                            $permanent->groupe_id=$groupe->id;
                            $permanent->locau_id=$locau->id;
                            $permanent->categoriegroupe_id=$categorie->id;
                            $permanent->agence_id=$agence->id;
                            $permanent->direction_id=$direction->id;
                            $permanent->pole_id=$pole? $pole->id : null;                        
                            $permanent->departement_id=$departement? $departement->id :null;
                            $permanent->service_id=$service? $service->id :null;
                            $permanent->agence_commercial_id=$commercial?$commercial->id:null;
                            $permanent->responsable_id=$request->responsable;
                            $message = "permanent mise en jour avec succès";
                            if($remplacer != 0)
                            {
                                if($permanent->etat == 0)
                                {
                                    $permanent->etat = 2;
                                }
                                $prof = Profile::find($remplacer);
                                $perm = Permanent::where('profile_id',$prof->id)->first();
                                $perRemp = PermanentOfRemplace::where('profile_id',$prof->id)->first();
                                $perRemp->etat = 0;
                                $perRemp->save();
                                if( $perm->etat == 1)
                                {
                                    $perm->etat = -1; 
                                }
                                if($perm->etat == 2 ){
                                    $perm->etat = 0;
                                }
                                $responsable_permanent = Permanent::where('responsable_id',$perm->id)->get();
                                $responsable_prestataire = Prestataire::where('responsable_id',$perm->id)->get();
                                $responsable_interimaire = Interim::where('responsable_id',$perm->id)->get();
                                $perm->save();
                                foreach($responsable_permanent as $permt){
                                    $perman = Permanent::find($permt->id);
                                    $perman->responsable_id = $permanent->id;
                                    $perman->save();
                                }
                                foreach($responsable_prestataire as $prest){
                                    $prestat = Prestataire::find($prest->id);
                                    $prestat->responsable_id = $permanent->id;
                                    $prestat->save();
                                }
                                foreach($responsable_interimaire as $inter){
                                    $interi = Interim::find($inter->id);
                                    $interi->responsable_id = $permanent->id;
                                    $interi->save();
                                }
                                $remplacer_perm = RemplacerPermanent::updateOrCreate([
                                    "remplacer"=>$prof->id,
                                    "remplacant"=>$profile->id,
                                ]);
                                $permanentARemplacer  = Permanent::find($id);
                                $permOfRemp = PermanentOfRemplace::firstOrCreate([
                                    'profile_id'=>$permanentARemplacer->profile_id],[
                                    'poste_id'=>$permanentARemplacer->poste_id,
                                    'canal_id'=>$permanentARemplacer->canal_id,
                                    'statut_id'=>$permanentARemplacer->statut_id,
                                    'groupe_id'=>$permanentARemplacer->groupe_id,
                                    'locau_id'=>$permanentARemplacer->locau_id,
                                    'categoriegroupe_id'=>$permanentARemplacer->categoriegroupe_id,
                                    'agence_id'=>$permanentARemplacer->agence_id,
                                    'direction_id'=>$permanentARemplacer->direction_id,
                                    'pole_id'=>$permanentARemplacer->pole_id? $permanentARemplacer->pole_id : null,
                                    'departement_id'=>$permanentARemplacer->departement_id? $permanentARemplacer->departement_id : null,
                                    'service_id'=>$permanentARemplacer->service_id? $permanentARemplacer->service_id : null,
                                    'responsable_id'=>$permanentARemplacer->responsable_id?$permanentARemplacer->responsable_id : null,
                                    'date'=>$permanentARemplacer->date,
                                    'motif'=>$permanentARemplacer->motif,
                                    'commentaire'=>$permanentARemplacer->commentaire,
                                    'etat'=>1,
                                ]);
                                $message = "permanent remplacé avec succès";
                            }
                            $permanent->save();
                            return $this->response->response(Response::HTTP_OK,$message,$permanent);
                        }
                        else{
                            $message = "permanent ajouter avec succès";
                            $permanent = Permanent::firstOrCreate([
                                'profile_id'=>$profile->id,
                                'poste_id'=>$poste->id,
                                'canal_id'=>$canal->id,
                                'statut_id'=>$statut->id,
                                'groupe_id'=>$groupe->id,
                                'locau_id'=>$locau->id,
                                'categoriegroupe_id'=>$categorie->id,
                                'agence_id'=>$agence->id,
                                'direction_id'=>$direction->id,
                                'pole_id'=>$request->pole? $pole->id : null,
                                'departement_id'=>$request->departement? $departement->id : null,
                                'service_id'=>$request->service? $service->id : null,
                                'agence_commercial_id'=>$request->agence_commercial?$commercial->id:null,
                                'responsable_id'=>$request->responsable,
                            ]);
                            if($remplacer != 0)
                            {
                                if($permanent->etat == 0)
                                {
                                    $permanent->etat = 0;
                                }
                                $prof = Profile::find($remplacer);
                                $perm = Permanent::where('profile_id',$prof->id)->first();
                                $perRemp = PermanentOfRemplace::where('profile_id',$prof->id)->first();
                                $perRemp->etat = 0;
                                if($perm->etat == 1)
                                {
                                    $perm->etat = -1; 
                                }if($perm->etat == 2)
                                {
                                    $perm->etat = 0;
                                }
                                $perm->save();
                                $perRemp->save();
                                $responsable_permanent = Permanent::where('responsable_id',$perm->id)->get();
                                $responsable_prestataire = Prestataire::where('responsable_id',$perm->id)->get();
                                $responsable_interimaire = Interim::where('responsable_id',$perm->id)->get();
                                $perm->save();
                                foreach($responsable_permanent as $permt)
                                {
                                    $perman = Permanent::find($permt->id);
                                    $perman->responsable_id = $permanent->id;
                                    $perman->save();
                                }
                                foreach($responsable_prestataire as $prest)
                                {
                                    $prestat = Prestataire::find($prest->id);
                                    $prestat->responsable_id = $permanent->id;
                                    $prestat->save();
                                }
                                foreach($responsable_interimaire as $inter)
                                {
                                    $interi = Interim::find($inter->id);
                                    $interi->responsable_id = $permanent->id;
                                    $interi->save();
                                }
                                $remplacer_perm = RemplacerPermanent::updateOrCreate([
                                    "remplacer"=>$prof->id,
                                    "remplacant"=>$profile->id,
                                ]);
                                $message = "permanent remplacer avec succès";
                            }
                            return $this->response->response(Response::HTTP_OK,$message,$permanent);
                        }
                    }
               }
            });
        }catch(QueryException $e)
        {
          return $this->response->response(Response::HTTP_BAD_REQUEST,"erreur",$e->getMessage());
        }
    }
    public function import(Request $request)
    {
        try{
           return DB::transaction(function() use($request)
           {
                request()->validate([
                    'files' => 'required|mimes:xlsx,xls|max:2048'
                ]);
                $file = $request->files;
                if($file->count()>0)
                {
                $file = $file->get('files');
                }
                $fastExcel = new FastExcel();
                $realisation =[];
                $import = $fastExcel->import($file);
                foreach ($import as $key => $value)
                {
                    $statut =isset($value['Statut'])? $this->controller->store($value['Statut'],'Statut','statut'):null;
                    $canal =isset($value['Canal'])? $this->controller->store($value['Canal'],"Canal","Canal"):null;
                    $groupe =isset($value['Groupe'])? $this->controller->store($value['Groupe'],"Groupe","Groupe"):null;
                    $locau = isset($value['Lieu d\'exécution'])? $this->controller->store($value['Lieu d\'exécution'],"Locau","locau"):null;
                    $categorie =isset( $value['Catégorie'])? $this->controller->store($value['Catégorie'],"Categoriegroupe","Categorie de groupe"):null;         
                    $service = null; $direction = null; $pole = null; $departement = null; $commercial =null;   
                    $poste = null;
                    if(isset($value['Poste']) && $value['Poste']!= null)
                    {
                        $poste = Poste::firstOrCreate([
                            'libelle'=>$value['Poste'],
                            'duree_kangurou'=>isset($value['Durée kangourou'])?$value['Durée kangourou']:null,
                            'montant_kangurou'=>isset($value['Montant kangourou'])?$value['Montant kangourou']:null
                        ]);
                    }
                    if(isset($value['Direction']) && $value['Direction']!= "N/A")
                    {
                        $direction = $this->controller->store($value['Direction'],"Direction","direction");
                    }
                    if(isset($value['Pole']) && $direction)
                    {   
                        $pole = $this->controller->create($value['Pole'],'direction_id',$direction->id,"Pole","pole");
                    }
                    if(isset($value['Département']) && $value['Département']!="N/A" && $pole)
                    {
                        $departement = $this->controller->create($value['Département'],'pole_id',$pole->id,"Departement","departement");
                    }
                    if(isset($value['Service'])  && $departement)
                    {
                        $service = $this->controller->create($value['Service'],'departement_id',$departement->id,"Service","service");
                    }
                    $explode = explode(' ',$value['Responsable Hiérarchique']);
                    $prenom="";$nom="";
                    $email=null;$adresse=null;$commentaire=null;
                    if(isset($value['Courriel']) && !empty($value['Courriel']) && $value['Courriel']!='N/A')
                    {
                        $email=$value['Courriel'];
                    }
                    if(isset($value['Adresse']) && !empty($value['Adresse']) && $value['Adresse']!='N/A')
                    {
                        $adresse=$value['Adresse'];
                    }
                    if(isset($value['Commentaire']) && !empty($value['Commentaire']) && $value['Commentaire']!='N/A')
                    {
                        $commentaire = $value['Commentaire'];
                    }
                    $profile = Profile::updateOrCreate([
                        "matricule"=>$value['Matricule'],
                    ],[
                        "prenom"=>$value['Prenom'],
                        'nom'=>$value['Nom'],
                        "telephone"=>$value['Téléphone'],
                        'telephone_pro'=>$value['Téléphone pro'],
                        'email'=>  $email,
                        'adresse'=>$adresse,
                        'commentaire'=>$commentaire,
                    ]);
                    if(count($explode)>=2)
                    {
                        $prenom = implode(' ',array_slice($explode,0,-1));
                        $nom = end($explode);
                    }
                    $userResponsabe = Profile::where(['prenom'=>$prenom,'nom'=>$nom])->first();
                    
                    $responsable = null;
                    $realisation[]=$userResponsabe;
                    if($direction!= null && $pole==null)
                    {
                        $responsable = Permanent::where('direction_id',$direction->id)->where('profile_id',$userResponsabe->id)->first();
                    }
                    if($pole!=null && $departement==null)
                    {
                        $responsable = Permanent::where('pole_id',$pole->id)->where('profile_id',$userResponsabe->id)->first();
                    }
                    if($departement!=null && $service==null)
                    {
                        $responsable = Permanent::where('departement_id',$departement->id)->where('profile_id',$userResponsabe->id)->first();
                    }
                    if($service!=null)
                    {
                        $responsable = Permanent::where('service_id',$service->id)->where('profile_id',$userResponsabe->id)->first();
                        if($responsable==null)
                        {
                            $responsable = Permanent::where('departement_id',$departement->id)->where('profile_id',$userResponsabe->id)->first();
                        }
                    }    
                    $agence = null;
                    if(isset($value['Agence interim']) && $value['Agence interim'] != null)
                    {
                        $agence = Agence::firstOrCreate([
                            'libelle'=>$value['Agence interim'],                
                        ]);   
                    }   
                    if(strtolower($statut->libelle)===strtolower("PRESTATAIRE"))
                    {
                        $prestataire = Prestataire::updateOrCreate([
                            'profile_id'=>$profile->id,
                        ],[
                            'poste_id'=>$poste->id,
                            'canal_id'=>$canal->id,
                            'statut_id'=>$statut->id,
                            'groupe_id'=>$groupe->id,
                            'categoriegroupe_id'=>$categorie->id,
                            'locau_id'=>$locau->id,
                            'agence_id'=>$agence->id,
                            'direction_id'=>$direction->id,
                            'pole_id'=>$pole? $pole->id :null,
                            'departement_id'=>$departement? $departement->id : null,
                            'service_id'=>$service? $service->id :null,
                            'agence_commercial_id'=>null,
                            'responsable_id'=>$responsable?$responsable->id:null,
                        ]);
                        // return $this->response->response(Response::HTTP_OK,"prestataire ajouter avec succès",$prestataire);
                    }
                    elseif (strtolower($statut->libelle) === strtolower("PERMANENT"))
                    {
                        
                        $permanent = Permanent::updateOrCreate([
                            'profile_id'=>$profile->id
                        ],[
                            'poste_id'=>$poste->id,
                            'canal_id'=>$canal->id,
                            'statut_id'=>$statut->id,
                            'groupe_id'=>$groupe->id,
                            'locau_id'=>$locau->id,
                            'categoriegroupe_id'=>$categorie->id,
                            'agence_id'=>$agence->id,
                            'direction_id'=>$direction->id,
                            'pole_id'=>$pole? $pole->id : null,
                            'departement_id'=>$departement? $departement->id : null,
                            'service_id'=>$service? $service->id : null,
                            'agence_commercial_id'=>null,
                            'responsable_id'=>$responsable?$responsable->id:null,
                        ]);
                    }
                    elseif(strtolower($statut->libelle) === strtolower("INTERIMAIRE"))
                    {
                        if (isset($value['Agence interim']) && isset($responsable))
                        {
                            $day_debut= isset($value['Date début'])? $value['Date début'] :0;
                            $day_fin= isset($value['Date fin'])? $value['Date fin'] :0;
                            $date_debut = $day_debut instanceof \DateTimeImmutable ? $day_debut->format('Y-m-d') : Carbon::createFromFormat('Y-m-d', $day_debut);
                            $date_fin = $day_fin instanceof \DateTimeImmutable ? $day_fin->format('Y-m-d') : Carbon::createFromFormat('Y-m-d', $day_fin);
                            $date_debut = explode(' ',$date_debut);
                            $date_fin = explode(' ',$date_fin);
                            $date_debut = ($date_debut instanceof Carbon) ? $date_debut[0] : Carbon::parse($date_debut[0]);
                            $date_fin = ($date_fin instanceof Carbon) ? $date_fin[0] : Carbon::parse($date_fin[0]);
                            $duree_contrat =( $date_debut->diffInMonths($date_fin)); 
                            $contrat = $duree_contrat + isset($value['Temps présence autres structures Sonatel'])?$value['Temps présence autres structures Sonatel']:0;
                            if($contrat>24){
                                return response()->json([
                                    "statut"=>Response::HTTP_BAD_REQUEST,
                                    "message"=>"le contrat est supérieur à deux ans; invalide!!!",
                                ]);
                            }
                            $categorieInterim= null;
                            $cout = isset($value['Coût unitaire (tarif journalier)'])?$value['Coût unitaire (tarif journalier)']:0;
                            if(isset($value['Catégorie Interim']) && $value['Catégorie Interim']!=null){
                                $categorieInterim = Categorie::updateOrCreate([
                                    'libelle'=>isset($value['Catégorie Interim'])?$value['Catégorie Interim']:'AM1',
                                ],[
                                    'cout_unitaire_journalier'=>$cout,
                                    'agence_id'=>$agence->id
                                ]);
                            }
                            $temps_presence_structure_actuel = isset($value['Temps présence structure actuelle'])?$value['Temps présence structure actuelle']:0;
                            $temps_presence_autre_structure =isset($value['Temps présence autres structures Sonatel'])?$value['Temps présence autres structures Sonatel']:0;
                            $temps_presence_cumul = ($temps_presence_structure_actuel/30) + $temps_presence_autre_structure;
                            // return response()->json($profile->id);
                            $interim = Interim::updateOrCreate([
                                'profile_id' => $profile?$profile['id']:null,                              
                                'statut_id' => $statut?$statut->id:null],[
                                'responsable_id' => $responsable?$responsable->id:null,
                                 'categorie_id' => $categorieInterim->id?$categorieInterim->id:null,
                                'poste_id' => $poste? $poste->id:null,
                                'groupe_id'=>$groupe->id,
                                'categoriegroupe_id'=>$categorie->id,
                                'etat' => isset($value['Etat'])?$value['Etat']:'en cours',
                            ]);
                            $message ="Contrat ajouter avec succès";        
                            $contrat = Contrat::updateOrCreate([
                                'interim_id' => $interim->id],[
                                'date_debut_contrat' => explode(' ',$date_debut)[0],
                                'date_fin_contrat' =>explode(' ',$date_fin)[0],
                                'temps_presence_structure_actuel' =>isset($value['Temps présence structure actuelle'])?$value['Temps présence structure actuelle']:0,
                                'temps_presence_autre_structure_sonatel'=>isset($value['Temps présence autres structures Sonatel'])?$value['Temps présence autres structures Sonatel']:0,
                                'cumul_presence_sonatel' => $temps_presence_cumul,
                                'duree_contrat' => isset($value['Durée contrat'])?$value['Durée contrat']:0,
                                'duree_contrat_restant' => isset($value['Durée contrat restante'])?$value['Durée contrat restante']:0,
                                'cout_mensuel' =>isset($value['Coût mensuel (tarif mensuel)'])?$value['Coût mensuel (tarif mensuel)']:0,
                                'cout_global' =>isset($value['Coût global'])?$value['Coût global']:0,
                                'DA' => isset($value['DA'])?$value['DA']:0,
                                'DA_kangurou' => isset($value['DA kangourou'])?$value['DA kangourou']:0,
                                'commentaire' => isset($value['Commentaire'])?$value['Commentaire']:0,
                            ]);
                        } 
                    }
                }
                return response()->json([
                    $realisation
                ]);
            });
        }catch(QueryException $e)
        {
            return $this->response->response(Response::HTTP_BAD_REQUEST,'erreur',$e->getMessage());
        }
    }
    public function supprimer(Request $request,$id)
    {
        try{
            return DB::transaction(function() use($request,$id)
            {
                $object = null;
                $profile = Profile::find($id);
                if($profile)
                {   
                    $permanent = Permanent::where('profile_id',$profile->id)->first();
                    $prestataire = Prestataire::where('profile_id',$profile->id)->first();
                    if($permanent)
                    {
                        $permanent->update(['date'=>$request->date,'motif'=>$request->motif,'etat'=>1,'commentaire'=>$request->commentaire]);   
                        $object = $permanent;
                        $permanentARemplacer = $permanent;
                        $permOfRemp = PermanentOfRemplace::firstOrCreate([
                            'profile_id'=>$permanentARemplacer->profile_id,
                            'poste_id'=>$permanentARemplacer->poste_id,
                            'canal_id'=>$permanentARemplacer->canal_id,
                            'statut_id'=>$permanentARemplacer->statut_id,
                            'groupe_id'=>$permanentARemplacer->groupe_id,
                            'locau_id'=>$permanentARemplacer->locau_id,
                            'categoriegroupe_id'=>$permanentARemplacer->categoriegroupe_id,
                            'agence_id'=>$permanentARemplacer->agence_id,
                            'direction_id'=>$permanentARemplacer->direction_id,
                            'pole_id'=>$permanentARemplacer->pole_id? $permanentARemplacer->pole_id : null,
                            'departement_id'=>$permanentARemplacer->departement_id? $permanentARemplacer->departement_id : null,
                            'service_id'=>$permanentARemplacer->service_id? $permanentARemplacer->service_id : null,
                            'responsable_id'=>$permanentARemplacer->responsable_id?$permanentARemplacer->responsable_id : null,
                            'date'=>$permanentARemplacer->date,
                            'motif'=>$permanentARemplacer->motif,
                            'commentaire'=>$permanentARemplacer->commentaire,
                            'etat'=>1,
                        ]);
                        
                    }else if($prestataire)
                    {
                        $prestataire->update(['date'=>$request->date,'motif'=>$request->motif,'etat'=>1,'commentaire'=>$request->commentaire]); 
                        $object = $prestataire;
                    }
                    else{
                        return $this->response->response(Response::HTTP_NO_CONTENT,'ce profile n\'est pas un permanent ni un prestataire',$profile);
                    }  
                    return $this->response->response(Response::HTTP_OK,"vous avez supprimer avec succès  $profile->prenom   $profile->nom .",PermanentResource::make($object));
                }
                return $this->response->response(Response::HTTP_BAD_REQUEST,'ce profile n\'existe pas ',$object);
            });
        }catch(QueryException $e){
            return $this->response->response(Response::HTTP_BAD_REQUEST,'erreur lors du traitement',$e);
        }
    }
    public function getSubstitution()
    {
        try{
            $permanents = PermanentOfRemplace::where('etat',1)->get();
            $data = [
                "dataPermanent"=>PermanentResource::collection($permanents),
            ];
            return $this->response->response(Response::HTTP_OK,'succès',$data);
        }catch(QueryException $e){
            return $this->response->response(Response::HTTP_BAD_REQUEST,"erreur",$e->getMessage());
        }
    }
    public function getListPermanent(Request $request)
    {
        try{
            $permanents = RemplacerPermanent::all();
            $perm = RemplacementResource::collection($permanents,"permanent");
            $permanentResources = $permanents->map(function ($permanent) {
                return new RemplacementResource($permanent, 'permanent');
            });
            return $this->response->response(Response::HTTP_OK,'succès',$permanentResources);
        }catch(QueryException $e){
            return  $this->response->response(Response::HTTP_BAD_REQUEST,"erreur",$e->getMessage());
        }
    }
}
