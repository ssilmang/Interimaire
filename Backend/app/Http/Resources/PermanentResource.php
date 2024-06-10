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
            'photo'=>$this->photo,
            'contrat'=>$this->contrat,
            'adresse'=>$this->adresse,
            'status'=>$this->status,
            'commentaire'=>$this->commentaire,
            'poste'=>PosteResource::make($this->poste),
            'canal'=>RoleResource::make($this->canal),
            'statut'=>RoleResource::make($this->statut),
            'groupe'=>RoleResource::make($this->groupe),
            'categorie'=>RoleResource::make($this->categoriegroupe),
            'agence'=>AgenceResource::make($this->agence),
            'direction'=>DirectionResponsableResource::make($this->direction),
            'locau'=>LocauResource::make($this->locau),
            'pole'=>PoleResponsableResource::make($this->pole),
            'departement'=>DepartementResponsableResource::make($this->departement),
            'service'=>ServiceResponsableResource::make($this->service),
            'responsable'=>UserResource::make($this->responsable),
            'collaborateurs'=>PermanentResource::collection($this->collaborateurs),
        ];
    }
}
