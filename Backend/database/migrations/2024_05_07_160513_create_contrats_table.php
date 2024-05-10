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
        Schema::create('contrats', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('interim_id');
            $table->date('date_debut_contrat');
            $table->date('date_fin_contrat')->nullable();
            $table->integer('temps_presence_structure_actuel')->nullable();
            $table->integer('temps_presence_autre_structure_sonatel')->nullable();
            $table->integer('cumul_presence_sonatel')->nullable();
            $table->integer('duree_contrat')->nullable();
            $table->integer('duree_contrat_restant')->nullable();
            $table->decimal('cout_mensuel', 10, 2)->nullable();
            $table->decimal('cout_global', 10, 2)->nullable();
            $table->decimal('DA', 10, 2)->nullable();
            $table->decimal('DA_kangurou', 10, 2)->nullable();
            $table->text('commentaire')->nullable();
            $table->string('etat')->nullable();
            $table->timestamps();

            $table->foreign('interim_id')->references('id')->on('interims')->onDelete('cascade');
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
