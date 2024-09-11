<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Annee extends Model
{
    use HasFactory;
    protected $guarded=['id'];
    public function annee_mois(){
        return $this->hasMany(AnneeMois::class);
    }
    public function mois(){
        return $this->belongsToMany(Mois::class);
    }
}
