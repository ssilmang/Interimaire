<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GroupeController extends Controller
{
    public $controller;
    public function __construct(HeriteController $controller)
    {
        $this->controller = $controller;
    }
    public function store(Request $request)
    {
        return $this->controller->store($request->libelle ,"Groupe","Groupe ajouter avec succès");
    }
    public function create(Request $request)
    {
        return $this->controller->store($request->libelle  ,"Categoriegroupe","categorie groupe ajouter avec succès");
    }
}
