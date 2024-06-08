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
        Schema::table('permanents', function (Blueprint $table) {
            $table->foreignId('locau_id')->nullable()->default(1)->constrained('locaus');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permanents', function (Blueprint $table) {
            //
        });
    }
};
