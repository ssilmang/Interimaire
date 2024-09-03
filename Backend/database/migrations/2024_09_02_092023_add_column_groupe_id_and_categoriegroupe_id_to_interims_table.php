<?php

use App\Models\Categoriegroupe;
use App\Models\Groupe;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('interims', function (Blueprint $table) {
            $table->foreignIdFor(Groupe::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Categoriegroupe::class)->constrained()->cascadeOnDelete();
        });
        DB::statement('ALTER TABLE interims ALTER COLUMN groupe_id SET DEFAULT 3');  
        DB::statement('ALTER TABLE interims ALTER COLUMN categoriegroupe_id SET DEFAULT 1');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('interims', function (Blueprint $table) {
            $table->dropForeign(['groupe_id']);
            $table->dropColumn('groupe_id');    
            $table->dropForeign(['categoriegroupe_id']);
            $table->dropColumn('categoriegroupe_id');
        });
    }
};
