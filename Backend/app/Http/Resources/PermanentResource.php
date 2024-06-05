<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PermanentResource extends JsonResource
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
            'avatar'=>$this->avatar,
            'contrat'=>$this->contrat,
            'adresse'=>$this->adresse,
            'status'=>$this->status,
            'commentaire'=>$this->commentaire,
            'poste'=>PosteResource::make($this->poste),
            'canal'=>AgenceResource::make($this->canal),
            'statut'=>AgenceResource::make($this->statut),
            'groupe'=>AgenceResource::make($this->groupe),
            'categorie'=>AgenceResource::make($this->categoriegroupe),
            'agence'=>AgenceResource::make($this->agence),
            'direction'=>DirectionResponsableResource::make($this->direction),
            'pole'=>PoleResponsableResource::make($this->pole),
            'departement'=>DepartementResponsableResource::make($this->departement),
            'service'=>ServiceResponsableResource::make($this->service),
            'responsable'=>UserResource::make($this->responsable),
            'collaborateurs'=>PermanentResource::collection($this->collaborateurs),
        ];
    }
}
