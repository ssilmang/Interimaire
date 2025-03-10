<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agence extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'libelle',
    ];
    public function categories()
    {
        return $this->hasMany(Categorie::class);
    }
}
