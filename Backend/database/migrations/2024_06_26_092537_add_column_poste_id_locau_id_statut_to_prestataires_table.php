<?php

use App\Models\Locau;
use App\Models\Poste;
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
        Schema::table('prestataires', function (Blueprint $table) {
            $table->foreignIdFor(Poste::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Locau::class)->constrained()->cascadeOnDelete();
            $table->boolean('etat')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prestataires', function (Blueprint $table) {
            //
        });
    }
};
