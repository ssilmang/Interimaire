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
            'user'=>UserResource::make($this->user),
            'Categorie'=>CategorieResource::make($this->categorie),
            'Responsable'=>ResponsableResource::make($this->responsable),
            'poste'=>PosteResource::make($this->poste),
        ];
    }
}
