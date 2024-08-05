<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Remplacer extends Model
{
    use HasFactory;
    protected $guarded = [];
    public function profileRemplacer()
    {
        return $this->belongsTo(Profile::class,"remplacer_id");
    }
    public function profileRemplacant()
    {
        return $this->belongsTo(Profile::class,"remplacant");
    }
}
