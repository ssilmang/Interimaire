<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Direction extends Model
{
    use HasFactory;

    protected $fillable = [
        'libelle',
        'locau_id',
        ];
    public function poles()
    {
        return $this->hasMany(Pole::class);
    }
    public function locau()
    {
        return $this->belongsTo(Locau::class);
    }
}
