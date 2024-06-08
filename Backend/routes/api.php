<?php

use App\Http\Controllers\AgenceCommercialsController;
use App\Http\Controllers\AgenceController;
use App\Http\Controllers\CanalController;
use App\Http\Controllers\CategorieController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LocalController;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\ChefDeServiceController;
use App\Http\Controllers\ContratController;
use App\Http\Controllers\DirectionController;
use App\Http\Controllers\GroupeController;
use App\Http\Controllers\InterimController;
use App\Http\Controllers\InterimsController;
use App\Http\Controllers\PermanentController;
use App\Http\Controllers\PoleController;
use App\Http\Controllers\PosteController;
use App\Http\Controllers\RemplacementsController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\StatutController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::controller(AgenceCommercialsController::class)->prefix("Interim")->group(function(){
    Route::Post('/agence_commercial',"store");
});


Route::controller(AgenceController::class)->prefix("Interim")->group(function(){
    Route::Post('/agence',"store");
});


Route::controller(CategorieController::class)->prefix("Interim")->group(function(){
    Route::Post('/categorie',"store");
});

Route::controller(ContratController::class)->prefix("Interim")->group(function(){
    Route::Post('/contrats',"store");
});
Route::controller(GroupeController::class)->prefix("Interim")->group(function(){
    Route::Post('/groupe',"store");
    Route::post('/categoriegroupe','create');
});
Route::controller(PermanentController::class)->prefix('Interim')->group(function(){
    Route::post('permanent','store');
    Route::get('index/permanents','index');
    Route::get('dv','getPermanent');
});

Route::controller(DepartementController::class)->prefix("Interim")->group(function(){
    Route::Post('/departement',"store");
});


Route::controller(DirectionController::class)->prefix("Interim")->group(function(){
    Route::Post('/direction',"store");
});



Route::controller(LocalController::class)->prefix("Interim")->group(function(){
    Route::Post('/locau',"store");
    Route::get('locaux/all',"index");
});


Route::controller(PoleController::class)->prefix("Interim")->group(function(){
    Route::Post('/pole',"store");
});


Route::controller(PosteController::class)->prefix("Interim")->group(function(){
    Route::Post('/poste',"store");
});
Route::controller(InterimController::class)->prefix('Interim')->group(function(){
    Route::post('interimaire','store');
    Route::get('interimaires','index');
    Route::post('image','inserImage');
    Route::get('indexImage','indexImage');
    
});

Route::controller(RemplacementsController::class)->prefix("Interim")->group(function(){
    Route::post('/remplacements',"store");
});
Route::controller(StatutController::class)->prefix('Interim')->group(function(){
    Route::post('statut','store');
    Route::get('index/statuts','index');
});
Route::controller(CanalController::class)->prefix('Interim')->group(function(){
    Route::post('canal','store');
});



Route::controller(RoleController::class)->prefix("Interim")->group(function(){
    Route::Post('/role',"store");
});


Route::controller(ServiceController::class)->prefix("Interim")->group(function(){
    Route::Post('/service',"store");
});


Route::controller(UserController::class)->prefix("Interim")->group(function(){
    Route::post('/user',"store");
    Route::post('/responsable',"store");
    Route::get('/interims',"contratsTermines");
    Route::get('/presence-time',"updatePresenceTime");
});


// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
