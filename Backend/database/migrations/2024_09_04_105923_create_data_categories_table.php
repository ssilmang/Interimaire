<?php

use App\Models\AnneeMois;
use App\Models\Categoriegroupe;
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
        Schema::create('data_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Categoriegroupe::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Statut::class)->constrained()->cascadeOnDelete();
            $table->string('libelle')->default('0');
            $table->foreignIdFor(AnneeMois::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_categories');
    }
};
