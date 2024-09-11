<?php

use App\Models\AnneeMois;
use App\Models\Canal;
use App\Models\DataCanal;
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
        Schema::create('data_groupes', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Groupe::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(DataCanal::class)->constrained()->cascadeOnDelete();
            $table->string('libelle')->default('0');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_groupes');
    }
};
