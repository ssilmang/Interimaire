<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContratResource extends JsonResource
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
            'date_debut_contrat' => $this->date_debut_contrat,
            'date_fin_contrat' => $this->date_fin_contrat,
            'temps_presence_structure_actuel'=>$this->temps_presence_structure_actuel,
            'temps_presence_autre_structure_sonatel'=>$this->temps_presence_autre_structure_sonatel,
            'cumul_presence_sonatel' => $this->cumul_presence_sonatel,
            'duree_contrat'=>$this->duree_contrat,
            'duree_contrat_restant'=>$this->duree_contrat_restant,
            'cout_mensuel'=>$this->cout_mensuel,
            'cout_global'=>$this->cout_global,
            'DA'=>$this->DA,
            'DA_kangurou'=>$this->DA_kangurou,
            'commentaire'=>$this->commentaire,
            'etat'=>$this->etat,
            'interim'=>$this->interim_id,
            
        ];;
    }
}
