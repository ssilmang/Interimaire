<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'libelle',
        'departement_id'
    ];

    public function responsables()
    {
        return $this->hasMany(Responsable::class);
    }
    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }
}
