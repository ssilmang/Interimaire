<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfilePermanentResource extends JsonResource
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
           'remplacer'=>PermanentResource::make($this->permanents),
           'remplacer'=>PermanentResource::make($this->permanents)
        ];
    }
}
