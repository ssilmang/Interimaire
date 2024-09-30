<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RemplacerPrestataire extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    public function profileRemplacerPrestataire()
    {
        return $this->belongsTo(Profile::class,"remplacer");
    }
    public function profileRemplacantPrestaire()
    {
        return $this->belongsTo(Profile::class,"remplacant");
    }
}
