<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class interim extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'categorie_id',
        'responsable_id',
        'poste_id',
        ];
}
