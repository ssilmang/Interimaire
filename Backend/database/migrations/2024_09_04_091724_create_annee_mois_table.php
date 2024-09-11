<?php

use App\Models\Annee;
use App\Models\Mois;
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
        Schema::create('annee_mois', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Annee::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Mois::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('annee_mois');
    }
};
