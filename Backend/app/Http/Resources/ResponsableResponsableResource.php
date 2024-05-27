<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResponsableResponsableResource extends JsonResource
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
            'service'=>$this->service ? serviceResponsableResource::make($this->service) : AgenceCommercialResponsableResource::make($this->agencecommercial),
            // 'agence'=>AgenceCommercialeResource::make($this->agencecommercial),
            // 'service'=>$this->service ? ServiceResource::make($this->service):AgenceCommercialeResource::make($this->agenceCommercial),
        ];
    }
}
