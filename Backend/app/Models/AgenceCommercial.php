<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgenceCommercial extends Model
{
    use HasFactory;

    protected $fillable = [
        'libelle',
        'adresse',
        'departement_id',
    ];
    public function departement()
    {
        return $this->belongsTo(Departement::class,'departement_id');
    }
}
