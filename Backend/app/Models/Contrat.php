<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contrat extends Model
{
    use HasFactory;

    protected $fillable = [
        'interim_id',
        'date_debut_contrat',
        'date_fin_contrat',
        'temps_prence_structure_actuel',
        'temps_presence_autre_structure_sonatel',
        'cumul_presence_sonatel',
        'duree_contrat',
        'duree_contrat_restant',
        'cout_mensuel',
        'cout_global',
        'DA',
        'DA_kangurou',
        'commentaire',
        'etat',
    ];
    public static function createOrUpdate($attributes)
    {
        $contrat = static::where('interim_id', $attributes['interim_id'])
                         ->where('date_debut_contrat', $attributes['date_debut_contrat'])
                         ->first();

        if ($contrat) {
            $contrat->update($attributes);
        } else {
            $contrat = static::create($attributes);
        }

        return $contrat;
    }

    public function interim()
    {
        return $this->belongsTo(Interim::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'interim_id');
    }
}

