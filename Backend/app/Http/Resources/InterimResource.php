<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InterimResource extends JsonResource
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
            'profile'=>ProfileResource::make($this->profile),
            'contrats'=>ContratResource::collection($this->contrats),
            'categorie'=>CategorieResource::make($this->categorie),
            'poste'=>PosteResource::make($this->poste),
            'responsable'=>ResponsableResponsableResource::make($this->responsable),
        ];
    }
}
