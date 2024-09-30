<?php

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
        Schema::create('remplacer_prestataires', function (Blueprint $table) {
            $table->id();
            $table->foreignId('remplacer')->constrained('profiles')->cascadeOnDelete();
            $table->foreignId('remplacant')->constrained('profiles')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('remplacer_prestataires');
    }
};
