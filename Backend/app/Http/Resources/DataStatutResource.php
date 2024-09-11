<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DataStatutResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=>$this->id,
            "annee_mois"=>AnneeMoisResource::make($this->annee_mois),
            "statut"=>$this->statut,
            "libelle"=>$this->libelle,
        ];
    }
}
