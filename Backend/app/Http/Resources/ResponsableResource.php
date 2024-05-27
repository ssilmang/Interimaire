<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResponsableResource extends JsonResource
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
            'user'=>UserResource::make($this->user),
            'departement'=>DepartementResource::make($this->departement),
            'service'=>$this->service ? ServiceResource::make($this->service):AgenceCommercialeResource::make($this->agenceCommercial),
        ];
    }
}
