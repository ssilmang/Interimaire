<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'email'=>$this->email,
            'telephone_pro'=>$this->telephone_pro,
            'matricule'=>$this->matricule,
            'telephone'=>$this->telephone,
            'role'=>RoleResource::make($this->role),
        ];
    }
}
