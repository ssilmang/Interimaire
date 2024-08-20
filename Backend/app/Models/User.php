<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable,SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
     protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'matricule',
        'username',
        'role_id',
        'telephone',
        'avatar',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function responsables()
    {
        return $this->hasMany(Responsable::class);
    }

    public function contrats()
    {
        return $this->hasMany(Contrat::class);
    }

    public function departement()
    {
    return $this->belongsTo(Departement::class);
    }



    public function Service()
    {
    return $this->belongsTo(Service::class);
    }


    public function local()
    {
    return $this->belongsTo(Locau::class);
    }


    public static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            $user->username = Str::slug($user->nom . '_' . $user->matricule, '_');
        });
    }


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}
