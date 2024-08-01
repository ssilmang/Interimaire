<?php

namespace App\Http\Controllers;

use App\Http\Resources\PermanentResource;
use App\Models\AgenceCommercial;
use App\Models\Categorie;
use App\Models\Direction;
use App\Models\Interim;
use App\Models\Permanent;
use App\Models\Poste;
use App\Models\Prestataire;
use App\Models\Profile;
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
        $collaborateurs = $permanents->collaborateurs()->paginate($index);
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
        $permanent = Permanent::where(['poste_id'=>$poste->id,'direction_id'=>$direction->id])->first();
        $data =["dvs"=>PermanentResource::make($permanent)];    
        return $this->response->response(Response::HTTP_OK,'index permanent dv',$data);
    }
    public function store(Request $request,$id=0,$idProfile=0,$upload="null",$contrat_id=0)
    {      
        try{
            return DB::transaction(function() use($request,$id,$idProfile,$upload,$contrat_id)
            {     
                $valide = $request->validate([
                    'statut'=>'required'
                ]);
                $file ="";
                $photo = '';
                $profile=0;
                $idInterim =  Interim::find($id);
                $idPermanent = Permanent::find($id);
                $idPrestataire = Prestataire::find($id);

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
                    $profile =$this->controller->updateUserProfile($request,$photo,$idProfile);
                }    
               if($statut->libelle === "Interimaire")
               {
                    if($upload == "null"){
                        $file->move('uploads/Interims/',$filename);
                    }

                    if($id!=0){
                    $int= $this->interimaire->update($request,$id,$statut,$profile,$contrat_id);
                    return $int;
                    }else{
                        $interim =$this->interimaire->store($request,$statut,$profile);
                    return $interim;
                    }
               }else
               {
                   $validate = $request->validate([
                       'poste'=>'required',
                       'canal'=>'required',
                       'groupe'=>'required',
                       'categorie'=>'required',
                       'agence'=>'required',
                       'statut'=>'required',
                    ]);
                    $canal = $this->controller->store($request->canal,"Canal","Canal");
                    $agence = $this->controller->store($request->agence,"Agence","Agence");
                    $groupe = $this->controller->store($request->groupe,"Groupe","Groupe");
                    $categorie = $this->controller->store($request->categorie,"Categoriegroupe","Categorie de groupe");
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
                    if($statut->libelle === "Prestataire")
                    {

                        if($upload == "null"){
                            $file->move('uploads/prestataire/',$filename);
                        }
                       if($id!=0){

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
                        $prestataire = Prestataire::firstOrCreate([
                            'profile_id'=>$profile->id,
                            'poste_id'=>$poste->id,
                            'canal_id'=>$canal->id,
                            'statut_id'=>$statut->id,
                            'groupe_id'=>$groupe->id,
                            'locau_id'=>$locau->id,
                            'categoriegroupe_id'=>$categorie->id,
                            'agence_id'=>$agence->id,
                            'direction_id'=>$direction->id,
                            'pole_id'=>$request->pole? $pole->id :null,
                            'departement_id'=>$request->departement? $departement->id : null,
                            'service_id'=>$request->service? $service->id :null,
                            'agence_commercial_id'=>$request->agence_commercial?$commercial->id:null,
                            'responsable_id'=>$request->responsable,
                        ]);
                        return $this->response->response(Response::HTTP_OK,"prestataire ajouter avec succès",$prestataire);
                       }
                    }else
                    {
                        
                        if($upload === "null"){
                            $file->move('uploads/higlights/',$filename);
                        }
                       
                        if($id!= 0){
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
                            $permanent->save();
                            return $this->response->response(Response::HTTP_OK,"permanent mise en jour avec succès",$permanent);
                        }
                        else{
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
                            return $this->response->response(Response::HTTP_OK,"permanent ajouter avec succès",$permanent);
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
           return DB::transaction(function() use($request){
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
                $statut = $this->controller->store($value['STATUT'],'Statut','statut');
                $canal = $this->controller->store($value['CANAL'],"Canal","Canal");
                $agence = $this->controller->store($value['AGENCE INTERIM'],"Agence","Agence");
                $groupe = $this->controller->store($value['GROUPE'],"Groupe","Groupe");
                $categorie = $this->controller->store($value['CATEGORIE'],"Categoriegroupe","Categorie de groupe");
                $poste = $this->controller->store($value['POSTES'],"Poste","Poste");
                $locau = $this->controller->store($value['LIEU D EXECUTION'],"Locau","locau");         
                $service = null; $direction = null; $pole = null; $departement = null; $commercial =null;   
                
                if(isset($value['DIRECTION']) && $value['DIRECTION']!= "N/A")
                {
                    $direction = $this->controller->store($value['DIRECTION'],"Direction","direction");
                }
                if(isset($value['POLE']) && $direction )
                {   
                    $pole = $this->controller->create($value['POLE'],'direction_id',$direction->id,"Pole","pole");
                }
                if(isset($value['DEPARTEMENT']) && $value['DEPARTEMENT']!="N/A" && $pole)
                {
                    $departement = $this->controller->create($value['DEPARTEMENT'],'pole_id',$pole->id,"Departement","departement");
                }
                if(isset($value['SERVICE'])  && $departement)
                {
                    $service = $this->controller->create($value['SERVICE'],'departement_id',$departement->id,"Service","service");
                }
                
                // if($service==null)
                // {
                //     $commercial = $this->controller->create($value['SERVICE'],'departement_id',$departement->id,"AgenceCommercial","agenceCommercial");
                // }
                $explode = explode(' ',$value['RESPONSABLE HIERARCHIQUE']);
                $prenom="";$nom="";
                 $email=null;$adresse=null;$commentaire=null;
                if(isset($value['EMAIL']) && !empty($value['EMAIL']) && $value['EMAIL']!='N/A'){
                    $email=$value['EMAIL'];
                }
                if(isset($value['ADRESSE']) && !empty($value['ADRESSE']) && $value['ADRESSE']!='N/A'){
                    $adresse=$value['ADRESSE'];
                }
                if(isset($value['COMMENTAIRE']) && !empty($value['COMMENTAIRE']) && $value['COMMENTAIRE']!='N/A'){
                    $commentaire = $value['COMMENTAIRE'];
                }
                $profile = Profile::updateOrCreate([
                    "matricule"=>$value['Mle'],
                ],[
                    "prenom"=>$value['PRENOMS'],
                    'nom'=>$value['NOM'],
                    "telephone"=>$value['TELEPHONE'],
                    'telephone_pro'=>$value['TELEPHONE PRO'],
                    'email'=>  $email,
                    'adresse'=>$adresse,
                    'commentaire'=>$commentaire,
                ]);
                if(count($explode)>=2)
                {
                    $prenom= implode(' ',array_slice($explode,0,-1));
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
                if(strtolower($statut->libelle)===strtolower("PRESTATAIRE"))
                {
                    $prestataire = Prestataire::updateOrCreate([
                        'profile_id'=>$profile->id,
                    ],[
                        'poste_id'=>$poste->id,
                        'canal_id'=>$canal->id,
                        'statut_id'=>$statut->id,
                        'groupe_id'=>$groupe->id,
                        'locau_id'=>$locau->id,
                        'categoriegroupe_id'=>$categorie->id,
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
                    // return $this->response->response(Response::HTTP_OK,"permanent ajouter avec succès",$permanent);
                }
                // elseif(strtolower($statut->libelle===strtolower("INTERIMAIRE")))
                // {
                //     // if (isset($request->categorieInterim) && isset($request->responsable) && isset($request->poste)) {
                //     //     $date_debut = Carbon::createFromFormat('Y-m-d',$value['DATE DEBUT']);
                //     //     $date_fin = Carbon::createFromFormat('Y-m-d',$value['DATE FIN']);
                //     //     $duree_contrat =( $date_debut->diffInMonths($date_fin));
                //     //     $contrat = $duree_contrat + $request->$value['AUTRE STRUCTURE'];
                //     //     if($contrat>24){
                //     //         return response()->json([
                //     //             "statut"=>Response::HTTP_BAD_REQUEST,
                //     //             "message"=>"le contrat est supérieur à deux ans; invalide!!!",
                //     //             ]);
                //     //             }
                //     //             $temps_presence_structure_actuel = 0;
                //     //             $temps_presence_total = $request->$value['AUTRE STRUCTURE'];
                //     //             $categorie = Categorie::where('libelle',$value['CATEGORIE'])->first();  
                                   
                //     //             $interim = new Interim();
                //     //             $interim->statut_id = $statut->id;
                //     //             $interim->profile_id = $profile->id;
                //     //             $interim->categorie_id = $categorie->id;
                //     //             $interim->responsable_id = $responsable;
                //     //             $interim->poste_id = $poste->id;
                //     //             $interim->save();
                //     //             $message ="Contrat ajouter avec succès";        
                                
                //     //             $cout_mensuel = $categorie->cout_unitaire_journalier *30;
                //     //             $cout_global = $cout_mensuel * $duree_contrat;
                //     //             $contrat = Contrat::createOrUpdate([
                //     //                 'interim_id' => $interim->id,
                //     //                 'date_debut_contrat' => $request->date_debut_contrat,
                //     //                 'date_fin_contrat' => $request->date_fin_contrat,
                //     //                 'temps_presence_autre_structure_sonatel' => $request->temps_presence_autre_structure_sonatel,
                //     //                 'temps_presence_structure_actuel'=>$temps_presence_structure_actuel,
                //     //                 'cumul_presence_sonatel' => $temps_presence_total,
                //     //                 'duree_contrat' => $duree_contrat,
                //     //                 'duree_contrat_restant' => $duree_contrat,
                //     //                 'cout_mensuel' => $cout_mensuel,
                //     //                 'cout_global' => $cout_global,
                //     //                 'DA' => $request->DA?$request->DA:0,
                //     //                 'DA_kangurou' => $request->DA_kangourou?$request->DA_kangourou:0,
                //     //                 'commentaire' => $request->commentaire,
                //     //             ]);
                            
                //     //             return response()->json([
                //     //                 'statut'=>Response::HTTP_OK,
                //     //                 'message'=>$message,
                //     //                 'data'=>$contrat,
                //     //             ]);
                //     // } 
                // }
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
}
