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
            'date'=>$this->date,
            'motif'=>$this->motif,
            'commentaire'=>$this->commentaire,
            'profile'=>ProfileResource::make($this->profile),
            'poste'=>PosteResource::make($this->poste),
            'etat'=>$this->etat?true:false,
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
            'agence_commercial'=>ServiceResponsableResource::make($this->agence_commercial),
            'responsable'=>ResponsableResource::make($this->responsable),
            // 'collaborateurs'=>$collaborateurs,
           
        ];
    }
}
