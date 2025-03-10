<?php

namespace App\Http\Controllers;

use App\Http\Resources\ResponsableResource;
use App\Http\Resources\UserProfileResource;
use App\Http\Resources\UserResource;
use App\Models\AgenceCommercial;
use App\Models\Contrat;
use App\Models\Service;
use App\Models\Departement;
use App\Models\Direction;
use App\Models\interim;
use App\Models\Locau;
use App\Models\Permanent;
use App\Models\Pole;
use App\Models\Prestataire;
use App\Models\Profile;
use App\Models\Responsable;
use App\Models\Role;
use App\Models\Statut;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;
use OpenSpout\Common\Entity\Style\Style;
use Rap2hpoutre\FastExcel\FastExcel;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class UserController extends Controller
{
    private $controller;
    public function __construct( HeriteController $controller){
        $this->controller= $controller; 
    }
    public function store(Request $request)
    {
        try {
            return DB::transaction(function() use($request) {
                $request->validate([
                    'nom' => 'required|string',
                    'prenom' => 'required|string',
                    'email' => 'required|email|unique:users,email',
                    'password' => 'required|min:8',
                    'matricule' => 'required|string|unique:users,matricule',
                    'telephone' => ['required', 'string', 'regex:/^(70|77|76|75|78)\d{7}$/', 'unique:users,telephone'],
                    'telephone_pro' => ['nullable', 'string', 'regex:/^(70|77|76|75|78)\d{7}$/', 'unique:users,telephone'],
                    'role' => 'string',
                ]);

            $role = $this->controller->store($request->role,'Role',"role ajouter avec succès");
                $username = Str::slug($request->nom . '_' . $request->matricule, '_');
                $user = User::create([
                    'nom' => $request->nom,
                    'prenom' => $request->prenom,
                    'email' => $request->email,
                    'password' =>$request->password,
                    'matricule' => $request->matricule,
                    'username' => $username,
                    'telephone' => $request->telephone,
                    'telephone_pro' => $request->telephone_pro,
                    'role_id' => $role->id, 
                ]);
                $message="utilisateur ajouter avec succès";
                return response()->json([
                    "statut" => 200,
                    "message" => $message,
                    "data" => UserResource::make($user),
                ]);
            });
        } catch (QueryException $e) {
            return response()->json([
                "status" => 221,
                "message" => "erreur",
                "data" => $e->getMessage(),
            ]);
        }
    }
    public function getResponsable(Request $request)
    {
        $responsable = Responsable::all();
        return response()->json([
            "statut"=>Response::HTTP_OK,
            "message"=>"all",
            "data"=>ResponsableResource::collection($responsable)

        ]);
    }
    public function login(Request $request)
    {
        try{
            
            $identifiants = $request->validate([
                'username'=>'required',
                'password'=>'required'
            ]);
            if(strpos($identifiants['username'],'@gmail.com'))
            {
                $user = Auth::attempt(["password"=>$identifiants['password'],"email"=>$identifiants['username']]);
            }
            else
            {
                $user =Auth::attempt($identifiants);
            }
            if(!$user)
            {
                return response()->json([
                    'statut'=>Response::HTTP_NO_CONTENT,
                    'message'=>"Mot de passe ou nom d'utilisateur incorrecte",
                ],422);
            }
            $user = Auth::user();         
            $token = $user->createToken('MON_TOKEN')->plainTextToken;
            return response()->json([
                'statut'=>Response::HTTP_OK,
                "message"=>"connecter avec succès",
                "data"=>[
                    "token"=>$token,
                    "user"=>UserResource::make($user)
                ]
            ],200);
        }catch(QueryException $e)
        {
            return response()->json([
                "statut"=>221,
                "message"=>"erreur",
                "data"=>$e->getMessage(),
            ]);
        }
    }
    public function logout()
    {
        $user=Auth::user();
        $user->currentAccessToken()->delete();
        return response()->json([
            "statut"=>Response::HTTP_NO_CONTENT,
            "message"=>"vous êtes déconnecter avec succès"
        ]);
    }
    public function export(Request $request,$permanents,$prestataires,$interims)
    {
        $permanentsIds = [];
        $prestatairesIds = [];
        $interimsIds = [];
        $fichier= 'gestion_rh_dv.xlsx';
        $relaltions=[$permanents,$prestataires,$interims];
        if ($permanents!='null')
        {
            $permanentsIds = Profile::whereHas('permanents',function($query){
                $query->where('etat',0);
            })->pluck('id')->toArray();
        }
        if ($prestataires!="null") 
        {
            $prestatairesIds = Profile::whereHas('prestataires',function($query){
                $query->where('etat',0);
            })->pluck('id')->toArray();
        }
        if ($interims!='null') 
        {
            $interimsIds = Profile::whereHas('interimaires',function($query){
                $query->where('etat',0);
            })->pluck('id')->toArray();
        }
        $allProfileIds = array_merge($permanentsIds, $prestatairesIds, $interimsIds);
        $allProfileIds = array_unique($allProfileIds);
        if($interims=='null' && $prestataires=='null')
        {
            $relaltions=[$permanents];
            $fichier = 'permanents.xlsx';
        }
        if($interims=='null' && $permanents=='null')
        {
            $relaltions=[$prestataires];
            $fichier = 'prestataires.xlsx';
        }
        if($permanents=='null' && $prestataires=='null')
        {
            $relaltions=[$interims];
            $fichier = 'interimaires.xlsx';
        }
        $userProfile = Profile::whereIn('id', $allProfileIds)
                            ->with($relaltions)
                            ->get();
       $data = $userProfile;   
       $dataDonnee = $data->map(function($item) use($permanents,$prestataires,$interims)
       {
        $profileData= [            
            "Matricule"=>$item['matricule'],
            'Prenom'=>  $item['prenom'],
            'Nom'=> $item['nom'],
            'Poste'=>'N/A',
            'Canal'=>'N/A',
            'Direction'=>'N/A',
            'Pole'=>'N/A',
            'Département'=>'N/A',
            'Service'=>'N/A',
            'Lieu d\'exécution'=>'N/A',
            'Responsable Hiérarchique'=>'N/A',
            'Statut'=>'N/A',
            'Agence interim'=>'N/A',
            'Groupe'=>'N/A',
            'Catégorie'=>'N/A',
            'Code Catégorie'=>'N/A',
            'MOUVEMENT /Avancement/Promotion'=>'N/A',
            'DATE DERNIER(E) : Avancement/Promotion'=>'N/A',
            'Téléphone'=>$item['telephone'],
            'Téléphone pro'=>$item['telephone_pro'],
            'Courriel'=>$item['email'],
            'Commentaire'=>$item['commentaire'],
        ];   
        if ($interims!='null' ||($interims!='null' && $prestataires!='null' && $permanents!='null'))
        {
            $profileData['DA']='N/A';
            $profileData['Date début']='N/A';
            $profileData['Date fin']='N/A';
            $profileData['Temps présence structure actuelle']='N/A';
            $profileData ['Temps présence autres structures Sonatel']='N/A';
            $profileData['Cumul temps de présence Sonatel']='N/A';
            $profileData['Durée kangourou']='N/A';
            $profileData['Durée contrat']='N/A';
            $profileData['Durée contrat restante']='N/A';
            $profileData ['Coût unitaire (tarif journalier)']='N/A';
            $profileData['Coût mensuel (tarif mensuel)']='N/A';
            $profileData ['DA kangourou']=0;
            $profileData['Montant kangourou']=0;
            $profileData['Coût global']=0;
            $profileData['Etat']='N/A';
        }
        if ($item[$permanents]!==null && $item[$permanents]->isNotEmpty()) 
        {
            $permanentData = $item['permanents']->first();    
            if($permanentData['poste']!==null)
            {
                $profileData['Poste'] = $permanentData['poste']['libelle'];
            }
            if($permanentData['pole']!=null)
            {            
                 $profileData['Pole'] = $permanentData['pole']['libelle'];
            }
            if($permanentData['direction']!==null){
                $profileData['Direction'] = $permanentData['direction']['libelle'];
            }
            if($permanentData['locau']!==null)
            {
                $profileData['Lieu d\'exécution'] = $permanentData['locau']['libelle'];
            }
            if($permanentData['departement']!=null)
            {
                $profileData['Département'] = $permanentData['departement']['libelle'];     
            }
            if($permanentData['service']!=null){
                $profileData['Service'] = $permanentData['service']['libelle'];
            }
            if($permanentData['responsable']!=null && $permanentData['responsable']['profile']!==null){
                $profileData['Responsable Hiérarchique'] = $permanentData['responsable']['profile']['prenom'].' '.$permanentData['responsable']['profile']['nom'];
            }
            if($permanentData['cananl']!==null)
            {
                $profileData['Canal'] = $permanentData['canal']['libelle'];
            }
            if($permanentData['statut']!==null)
            {
                $profileData['Statut'] = $permanentData['statut']['libelle'];
            }
           if($permanentData['groupe']!==null)
           {
            $profileData['Groupe'] = $permanentData['groupe']['libelle'];
           }
           if($permanentData['categoriegroupe']!==null)
           {
            $profileData['Catégorie'] = $permanentData['categoriegroupe']['libelle'];
           }
            if($permanentData['agence'])
            {
                $profileData['Agence interim'] = $permanentData['agence']['libelle'];
            }
        } elseif($item[$prestataires]!==null && $item[$prestataires]->isNotEmpty())
        {
            $prestataireData = $item['prestataires']->first();
            if($prestataireData['poste']!=null)
            {
                $profileData['Poste'] = $prestataireData['poste']['libelle'];
            }
            if($prestataireData['pole']!=null)
            {
                $profileData['Pole'] = $prestataireData['pole']['libelle'];
            }
            if($prestataireData['direction']!=null)
            {
                $profileData['Direction'] = $prestataireData['direction']['libelle'];
            }
            if($prestataireData['locau']!=null)
            {
                $profileData['Lieu d\'exécution'] = $prestataireData['locau']['libelle'];
            }
            if($prestataireData['departement']!=null)
            {
                $profileData['Département'] = $prestataireData['departement']['libelle'];
            }
            if($prestataireData['service'])
            {
                $profileData['Service'] = $prestataireData['service']['libelle'];
            }
            if($prestataireData['responsable']!=null && $prestataireData['responsable']['profile']!==null)
            {
                $profileData['Responsable Hiérarchique'] = $prestataireData['responsable']['profile']['prenom'].' '.$prestataireData['responsable']['profile']['nom'];
            }
            if($prestataireData['canal']!=null)
            {
                $profileData['Canal'] = $prestataireData['canal']['libelle'];
            }
            if($prestataireData['statut']!=null)
            {
                $profileData['Statut'] = $prestataireData['statut']['libelle'];
            }
            if($prestataireData['groupe']!=null)
            {
                $profileData['Groupe'] = $prestataireData['groupe']['libelle'];
            }
            if($prestataireData['categoriegroupe']!=null)
            {
                $profileData['Catégorie'] = $prestataireData['categoriegroupe']['libelle'];
            }
            if($prestataireData['agence'])
            {
                $profileData['Agence interim'] = $prestataireData['agence']['libelle'];
            }
        }elseif($item[$interims]!=null && $item[$interims]->isNotEmpty())
        {
            $interimaireData = $item['interimaires']->first();
            if($interimaireData['etat']!=null){
                $profileData['Etat']=$interimaireData['etat'];
            }
            if($interimaireData['poste']!=null)
            {
                $profileData['Poste'] = $interimaireData['poste']['libelle'];
                $profileData['Montant kangourou'] = $interimaireData['poste']['montant_kangurou']?$interimaireData['poste']['montant_kangurou']:0;
                $profileData['Durée kangourou'] = $interimaireData['poste']['duree_kangurou']?$interimaireData['poste']['duree_kangurou']:0;
            }
            if($interimaireData['statut']!=null)
            {
                $profileData['Statut'] = $interimaireData['statut']['libelle'];
            }
            if($interimaireData['locau']!=null)
            {
                $profileData['Lieu d\'exécution'] = $interimaireData['locau']['libelle'];
            }
            if($interimaireData['responsable']!=null)
            {
                if($interimaireData['responsable']['pole']!=null)
                {
                    $profileData['Pole'] = $interimaireData['responsable']['pole']['libelle'];
                }        
                if($interimaireData['responsable']['direction']!=null)
                {
                    $profileData['Direction'] = $interimaireData['responsable']['direction']['libelle'];
                }
                if($interimaireData['responsable']['departement']!=null)
                {
                    $profileData['Département'] = $interimaireData['responsable']['departement']['libelle'];
                }
                if($interimaireData['responsable']['service']!=null)
                {
                    $profileData['Service'] = $interimaireData['responsable']['service']['libelle'];
                }
                if($interimaireData['responsable']['profile']!=null)
                {
                    $profileData['Responsable Hiérarchique'] = $interimaireData['responsable']['profile']['prenom'].' '.$interimaireData['responsable']['profile']['nom'];
                }
                if($interimaireData['responsable']['canal']!=null)
                {
                    $profileData['Canal'] = $interimaireData['responsable']['canal']['libelle'];
                }
            }
            if($interimaireData['groupe']!==null)
            {
                $profileData['Groupe'] = $interimaireData['groupe']['libelle'];
            }
            if($interimaireData['categoriegroupe']!==null)
            {
                $profileData['Catégorie'] = $interimaireData['categoriegroupe']['libelle'];
            }
            if($interimaireData['categorie']!=null)
            {
                $profileData['Code Catégorie'] = $interimaireData['categorie']['libelle'];
                $profileData['Agence interim'] = $interimaireData['categorie']['agence']['libelle'];
                $profileData['Coût unitaire (tarif journalier)'] = $interimaireData['categorie']['cout_unitaire_journalier'];
            }

            if($interimaireData['contrats'] && $interimaireData['contrats']->isNotEmpty())
            {
                $contrat = $interimaireData['contrats']->first();
                $profileData['Date début'] = $contrat['date_debut_contrat'];
                $profileData['Date fin'] = $contrat['date_debut_contrat'];
                $profileData['Temps présence structure actuelle'] = $contrat['temps_presence_structure_actuel'];
                $profileData['Temps présence autres structures Sonatel'] = $contrat['temps_presence_autre_structure_sonatel'];
                $profileData['Cumul temps de présence Sonatel'] = $contrat['cumul_presence_sonatel'];
                $profileData['Durée contrat'] = $contrat['duree_contrat'];
                $profileData['Durée contrat restante'] = $contrat['duree_contrat_restant'];
                $profileData['Coût mensuel (tarif mensuel)'] = $contrat['cout_mensuel'];
                $profileData['Coût global'] = $contrat['cout_global'];
                $profileData['DA'] = $contrat['DA'];
                $profileData['DA kangourou'] = $contrat['DA_kangurou'];
            }   
            if($interimaireData['groupe']!=null)
            {
                $profileData['Groupe'] = $interimaireData['groupe']['libelle'];
            }
            if($interimaireData['agence']!=null)
            {
                $profileData['Agence interim'] = $interimaireData['agence']['libelle'];
            }
        }
        return $profileData;
       })->toArray();
       $header_style = (new Style())
       ->setFontBold()
       ->setFontColor("FFFFFF")
       ->setBackgroundColor("FFA510")
       ->setShouldWrapText(true);
       $rows_style = (new Style())
           ->setFontSize(12)
           ->setShouldWrapText(true);
        return ( new FastExcel($dataDonnee))->headerStyle($header_style)->rowsStyle($rows_style)->download($fichier);
    }
   
}
