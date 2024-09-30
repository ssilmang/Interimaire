<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpKernel\Profiler\Profiler;

class ProfileRemplacerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    protected $statut;
    public function __construct($resource,$statut="permanent")
    {
        parent::__construct($resource);
        $this->statut = $statut;
    }
    public function toArray(Request $request): array
    {
        $resources = null;
        $key ='interimaires';
        if($this->statut == "permanent"){
            $key = 'permanents';
            $resources =  PermanentResource::collection($this->permanentOfRemplaces);
        }elseif($this->statut === "prestataire"){
            $key = 'permanents';
            $resources =  PermanentResource::collection($this->prestataireOfRemplaces);
        }
        else{
            $resources = InterimResource::collection($this->interimaires);
        }
        return [
            $key=>$resources ,
        ];
    }
}
