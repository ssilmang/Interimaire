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
        Schema::table('prestataires', function (Blueprint $table) {
            $table->foreignId('agence_commercial_id')->nullable()->constrained('agence_commercials');
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
