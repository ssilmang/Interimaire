<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RemplacerPermanent extends Model
{
    use HasFactory;
    protected $guarded=['id'];
    public function profileRemplacerPermanent()
    {
        return $this->belongsTo(Profile::class,"remplacer");
    }
    public function profileRemplacantPermanent()
    {
        return $this->belongsTo(Profile::class,"remplacant");
    }
}
