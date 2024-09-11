<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnneeMoisResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
           "id"=> $this->id,
           "mois"=>RoleResource::make($this->mois),
           "annee"=>RoleResource::make($this->annee),
        ];
    }
}
