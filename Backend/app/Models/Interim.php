<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Interim extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'categorie_id',
        'responsable_id',
        'poste_id',
        ];
    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }
    public function poste()
    {
        return $this->belongsTo(Poste::class);
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
}
