<?php

namespace App\Http\Controllers;

use App\Models\Canal;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class CanalController extends Controller
{
    public $heritageController;
    public function __construct(HeriteController $heritageController)
    {
        $this->heritageController = $heritageController;
    }
    public function store(Request $request)
    {
      return $this->heritageController->store($request->libelle,"Canal","Canal ajouter avec succès");
    }
}
