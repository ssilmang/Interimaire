<?php

use App\Models\Departement;
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
        Schema::create('agence_commercials', function (Blueprint $table) {
            $table->id();
            $table->string('libelle');
            $table->string('adresse')->nullable();
            $table->foreignIdFor(Departement::class)->constrained()->cascadeOnDelete();
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agence_commercials');
    }
};
