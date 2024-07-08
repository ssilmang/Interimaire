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
        Schema::table('interims', function (Blueprint $table) {
            $table->enum('etat',["en cours","annuler","rompre","terminer"])->default('en cours');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('interims', function (Blueprint $table) {
            //
        });
    }
};
