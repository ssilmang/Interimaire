<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contrat extends Model
{
    use HasFactory,SoftDeletes;

    protected $guarded = ['id'];
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

