<?php

use App\Models\Interim;
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
        Schema::create('contrats', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Interim::class)->constrained()->cascadeOnDelete();
            $table->date('date_debut_contrat');
            $table->date('date_fin_contrat')->nullable();
            $table->integer('temps_presence_structure_actuel')->nullable();
            $table->integer('temps_presence_autre_structure_sonatel')->nullable();
            $table->integer('cumul_presence_sonatel')->nullable();
            $table->integer('duree_contrat')->nullable();
            $table->integer('duree_contrat_restant')->nullable();
            $table->integer('cout_mensuel')->nullable();
            $table->integer('cout_global')->nullable();
            $table->integer('DA')->nullable();
            $table->integer('DA_kangurou')->nullable();
            $table->longText('commentaire')->nullable();
            $table->string('etat')->nullable();
            $table->timestamps();


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contrats');
    }
};
