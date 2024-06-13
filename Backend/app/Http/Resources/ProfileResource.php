<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'nom'=>$this->nom,
            'prenom'=>$this->prenom,
            'matricule'=>$this->matricule,
            'email'=>$this->email,
            'telephone'=>$this->telephone,
            'telephone_pro'=>$this->telephone_pro,
            'photo'=>$this->photo,
            'contrat'=>$this->contrat,
            'adresse'=>$this->adresse,
            'status'=>$this->status,
            'commentaire'=>$this->commentaire,
        ];
    }
}
