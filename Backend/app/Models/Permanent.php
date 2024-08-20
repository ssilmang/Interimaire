<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Permanent extends Model
{
    use HasFactory,SoftDeletes;
    protected $guarded = ['id'];
    public function canal()
    {
        return $this->belongsTo(Canal::class);
    }
    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }
    public function categoriegroupe()
    {
        return $this->belongsTo(Categoriegroupe::class);
    }
    public function agence_commercial()
    {
        return $this->belongsTo(AgenceCommercial::class);
    }
    public function poste()
    {
        return $this->belongsTo(Poste::class);
    }
    public function agence()
    {
        return $this->belongsTo(Agence::class);
    }
    public function statut()
    {
        return $this->belongsTo(Statut::class);
    }
    public function direction()
    {
        return $this->belongsTo(Direction::class);
    }
    public function pole()
    {
        return $this->belongsTo(Pole::class);
    }
    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
    public function responsable()
    {
        return $this->belongsTo(Permanent::class);
    }
    public function collaborateurs()
    {
        return $this->hasMany(Permanent::class,'responsable_id');
    }
    public function locau(){
        return $this->belongsTo(Locau::class);
    }
    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
