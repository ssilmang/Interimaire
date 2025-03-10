<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mois extends Model
{
    use HasFactory;
    protected $guarded=['id'];
    public function annee_mois(){
        return $this->hasMany(AnneeMois::class);
    }
}
