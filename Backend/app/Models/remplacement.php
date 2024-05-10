<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class remplacement extends Model
{
    use HasFactory;

    protected $fillable = [
        'contrat_id',
        'statut'
        ];
}
