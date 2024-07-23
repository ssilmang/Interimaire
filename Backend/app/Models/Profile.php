<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;
    protected $guarded=['id'];
    public function permanents()
    {
        return $this->hasMany(Permanent::class,'profile_id');
    }
    public function prestataires()
    {
        return $this->hasMany(Prestataire::class);
    }
    public function interimaires()
    {
        return $this->hasMany(Interim::class);
    }
}
