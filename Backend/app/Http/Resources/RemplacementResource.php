<?php

namespace App\Http\Resources;

use App\Models\Permanent;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RemplacementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public $statut;
    public function __construct($resource,$statut = 'permanent')
    {
        parent::__construct($resource);
        $this->statut = $statut;
    }
    public function toArray(Request $request): array
    {
         
        $remplacer  = $this->profileRemplacer;
        $remplacant = $this->profileRemplacant;
         if($this->statut=="permanent"){
            $remplacer =$this->profileRemplacerPermanent;
            $remplacant = Profile::find($this->remplacant);
        }
        if($this->statut == "prestataire")
        {
            $remplacer = $this->profileRemplacerPrestataire;
            $remplacant = Profile::find($this->remplacant);
        }
        return [
            'id' => $this->id,
            "rem"=>$this->remplacer,
            'remplacer'=>new ProfileRemplacerResource($remplacer,$this->statut),
            'remplacant'=>new ProfilePermanentResource($remplacant,$this->statut),
        ];
    }
}
