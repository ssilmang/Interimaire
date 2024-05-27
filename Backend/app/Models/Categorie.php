<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    use HasFactory;

    protected $fillable = [
        'libelle',
        'agence_id'
    ];
    public function agence()
    {
        return $this->belongsTo(Agence::class);
    }
}
