<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataStatut extends Model
{
    use HasFactory;
    protected $guarded =['id'];
    public function statut(){
        return $this->belongsTo(Statut::class);
    }
    public function annee_mois(){
        return $this->belongsTo(AnneeMois::class);
    }
}
