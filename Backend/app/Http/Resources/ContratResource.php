<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContratResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => UserResource::make($this->user),
            'poste' => PosteResource::make($this->poste),
            'responsable' => ResponsableResource::make($this->responsable),
            'agence' => AgenceResource::make($this->agence),
            'categorie' => CategorieResource::make($this->categorie),
            'date_debut_contrat' => $this->date_debut_contrat,
            'cumul_temps_presence' => $this->cumul_temps_presence,
            'date_fin_contrat' => $this->date_fin_contrat,
        ];;
    }
}
