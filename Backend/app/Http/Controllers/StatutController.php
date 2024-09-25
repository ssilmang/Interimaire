<?php

namespace App\Http\Controllers;

use App\Http\Resources\AgenceResource;
use App\Http\Resources\DirectionResource;
use App\Http\Resources\LocauResource;
use App\Http\Resources\PermanentResource;
use App\Http\Resources\PosteResource;
use App\Http\Resources\ResponsableResource;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Models\Canal;
use App\Models\Permanent;
use App\Models\Statut;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class StatutController extends Controller
{
    protected $heriteController,$response;
   public function __construct(HeriteController $heriteController,ResponseController $response)
   {
        $this->heriteController = $heriteController;
        $this->response = $response;
   }
    public function store(Request $request)
    {
        $this->heriteController->store($request,"Statut","Statut ajouter avec succès");
    }
    public function index(){
        $statut = $this->heriteController->index("Statut");
        $canal = $this->heriteController->index("Canal");
        $groupe = $this->heriteController->index("Groupe");
        $categorie = $this->heriteController->index("Categoriegroupe");
        $agence = $this->heriteController->index("Agence");
        $direction = $this->heriteController->index("Direction");
        $responsable = $this->heriteController->index('Permanent');
        $locaux = $this->heriteController->index('Locau');
        $poste = $this->heriteController->index("Poste");
        $pole = $this->heriteController->index("Pole");
        $department = $this->heriteController->index("Departement");
        $service = $this->heriteController->index("Service");

        $data = [
            'canals'=>RoleResource::collection($canal),
            'statuts'=>RoleResource::collection($statut),
            'postes'=>PosteResource::collection($poste),
            'groupes'=>RoleResource::collection($groupe),
            'categories'=>RoleResource::collection($categorie),
            'agences'=>AgenceResource::collection($agence),
            'directions'=>DirectionResource::collection($direction),
            'responsable'=>ResponsableResource::collection($responsable),
            'locaux'=>LocauResource::collection($locaux),
            'poles'=>RoleResource::collection($pole),
            'departements'=>RoleResource::collection($department),
            'services'=>RoleResource::collection($service),

        ];
        return $this->response->response(Response::HTTP_OK,"All",$data);   
    }
    public function getResponse()
    {
        $permanent = Permanent::where('etat',0)->get();
        return $this->response->response(Response::HTTP_OK,"All",PermanentResource::collection($permanent));
    }
}
