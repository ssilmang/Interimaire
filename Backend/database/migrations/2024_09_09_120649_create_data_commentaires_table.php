<?php

use App\Models\AnneeMois;
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
        Schema::create('data_commentaires', function (Blueprint $table) {
            $table->id();
            $table->longText('commentaireStat')->nullable();
            $table->longText('commentaireAgenc')->nullable();
            $table->longText('commentaireCateg')->nullable();
            $table->longText('commentaireDepartenement')->nullable();
            $table->longText('commentaireCan')->nullable();
            $table->longText('commentaireRang')->nullable();
            $table->foreignIdFor(AnneeMois::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_commentaires');
    }
};
