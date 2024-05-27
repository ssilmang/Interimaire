<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pole extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'libelle',
        'direction_id'
    ];
    public function departements()
    {
        return $this->hasMany(Departement::class);
    }
    public function direction()
    {
        return $this->belongsTo(Direction::class);
    }
}
