<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartementResource extends JsonResource
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
            'libelle'=>$this->libelle,
            'services'=>$this->services->isNotEmpty()? ServiceResource::collection($this->services):null,
            'agence_commercials'=>AgenceCommercialeResource::collection($this->agenceCommerciales),
        ];
    }
}
