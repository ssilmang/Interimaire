<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Interim extends Model
{
    use HasFactory,SoftDeletes;
    protected $guarded = ['id'];
    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }
    public function categoriegroupe()
    {
        return $this->belongsTo(Categoriegroupe::class);
    }
    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }
    public function poste()
    {
        return $this->belongsTo(Poste::class);
    }
    public function statut()
    {
        return $this->belongsTo(Statut::class);
    }
    public function responsable()
    {
        return $this->belongsTo(Permanent::class);
    }
    public function contrats()
    {
        return $this->hasMany(Contrat::class);
    }
    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
    public function locau(){
        return $this->belongsTo(Locau::class);
    }
}
