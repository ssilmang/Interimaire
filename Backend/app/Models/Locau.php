<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Locau extends Model
{
    use HasFactory;
    protected $table = 'locaus';
    protected $fillable = [
        'libelle',
        'adresse'
    ];

    public function departements()
    {
        return $this->hasMany(Departement::class);
    }
    public function directions()
    {
        return $this->hasMany(Direction::class);
    }
}
