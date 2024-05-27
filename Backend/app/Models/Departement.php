<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departement extends Model
{
    use HasFactory;

    protected $fillable = [
        'libelle',
        'pole_id'
        ];

    public function pole()
    {
        return $this->belongsTo(Pole::class, 'pole_id');
    }
    public function services()
    {
        return $this->hasMany(Service::class);
    }
    public function agenceCommerciales()
    {
        return $this->hasMany(AgenceCommercial::class);
    }


}
