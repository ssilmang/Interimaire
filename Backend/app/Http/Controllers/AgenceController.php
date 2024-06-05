<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Agence;

class AgenceController extends Controller
{
    public $controller;
    public function __construct(HeriteController $controller)
    {
        $this->controller = $controller;
    }
    public function store(Request $request)
    {
        return $this->controller->store($request->libelle ,"Agence","agence ajouter avec succès");
       
    }
}
