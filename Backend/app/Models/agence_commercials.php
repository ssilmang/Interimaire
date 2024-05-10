<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class agence_commercials extends Model
{
    use HasFactory;

    protected $fillable = [
        'libelle',
        'adresse',
        'departement_id',
    ];
}
