<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RemplacementResource extends JsonResource
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
            'remplacer'=>ProfileRemplacerResource::make($this->profileRemplacer),
            'remplacant'=>ProfileRemplacerResource::make($this->profileRemplacant),
        ];
    }
}
