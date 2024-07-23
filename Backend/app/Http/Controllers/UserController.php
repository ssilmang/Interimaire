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
use App\Models\Pole;
use App\Models\Profile;
use App\Models\Responsable;
use App\Models\Role;
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
use Rap2hpoutre\FastExcel\FastExcel;

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
    public function export(Request $request)
    {
        $userProfile = Profile::all();
       
       $data = UserProfileResource::collection($userProfile);
    //    $data = $data->map(function ($item) {
    //        return $item->toArray();
    //     });
        return response()->json(
            $data
        );
        return ( new FastExcel($data))->download('file.xlsx');
       
    }
}


