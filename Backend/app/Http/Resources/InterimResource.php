<?php

namespace App\Http\Resources;

use App\Models\Contrat;
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
            // 0 ETAT EN COURS
            // 1 ETAT ROMPRE
            // -1 ETAT TERMINER  
        $contrat = Contrat::where('interim_id',$this->id)->whereIn('etat',[0,1,-1])->orderBy('date_debut_contrat','desc')->first();
        return [
            'id' => $this->id,
            'etat'=>$this->etat,
            'statut'=>RoleResource::make($this->statut),
            'profile'=>ProfileResource::make($this->profile),
            'contrats'=>$contrat ? ContratResource::make($contrat): null,
            'categorie'=>CategorieResource::make($this->categorie),
            'poste'=>PosteResource::make($this->poste),
            'responsable'=>ResponsableResponsableResource::make($this->responsable),
            'locau'=>RoleResource::make($this->locau),
            'groupe'=>RoleResource::make($this->groupe),
            'categorieGroupe'=>RoleResource::make($this->categorieGroupe)
        ];
    }
}
