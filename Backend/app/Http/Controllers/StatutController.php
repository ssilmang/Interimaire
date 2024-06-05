<?php

namespace App\Http\Controllers;

use App\Models\Canal;
use App\Models\Statut;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class StatutController extends Controller
{
    protected $heriteController;
   public function __construct(HeriteController $heriteController)
   {
        $this->heriteController = $heriteController;
   }
    public function store(Request $request)
    {
        $this->heriteController->store($request,"Statut","Statut ajouter avec succès");
    }
}
