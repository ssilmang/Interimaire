<?php

use App\Models\Agence;
use App\Models\Canal;
use App\Models\Categoriegroupe;
use App\Models\Groupe;
use App\Models\Statut;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('permanents', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Canal::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Groupe::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Categoriegroupe::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Agence::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Statut::class)->constrained()->cascadeOnDelete();
            $table->foreignId('direction_id')->nullable()->constrained('directions');
            $table->foreignId('pole_id')->nullable()->constrained('poles');
            $table->foreignId('departement_id')->nullable()->constrained('departements');
            $table->foreignId('responsable_id')->nullable()->constrained('permanents');
            $table->foreignId('service_id')->nullable()->constrained('services');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permanents');
    }
};
