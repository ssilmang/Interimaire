<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Profile extends Model
{
    use HasFactory,SoftDeletes;
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
        return $this->hasMany(Interim::class,"profile_id");
    }
}
