<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Responsable extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'departement_id',
        'service_id',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
    public function agencecommercial()
    {
        return $this->belongsTo(AgenceCommercial::class);
    }
    public function departement()
    {
        return $this->belongsTo(Departement::class);
    }
}
