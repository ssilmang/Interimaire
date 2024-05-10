<?php

use App\Http\Controllers\AgenceCommercialsController;
use App\Http\Controllers\AgenceController;
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
use App\Http\Controllers\InterimsController;
use App\Http\Controllers\PoleController;
use App\Http\Controllers\PosteController;
use App\Http\Controllers\RemplacementsController;
use App\Http\Controllers\ServiceController;


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
// Route::post('/roles', [RoleController::class, 'store']);

// Route::post('/users', [UserController::class, 'store']);
// Route::controller(UserController::class)->prefix("Interim")->group(function(){
//     Route::get('/users',"GuetResponsable");
// });


// Route::controller(PosteController::class)->prefix("Interim")->group(function(){
//     Route::get('/Postes',"index");
//     Route::Post('/Postes',"store");
// });


// Route::controller(ContratController::class)->prefix("Interim")->group(function(){
//     Route::get('/Contrats',"index");
//     Route::Post('/Contrats',"store");
// });

// Route::post('/departements', [DepartementController::class, 'store']);
// Route::post('/locaux', [LocalController::class, 'store']);

// Route::post('/agences', [AgenceController::class, 'store']);
// Route::post('/categories', [CategorieController::class, 'store']);

// Route::prefix('sonatel-dv')->group(function () {
//     Route::get('/chef-de-service', [ChefDeServiceController::class, 'index']);
//     Route::post('/chef-de-service', [ChefDeServiceController::class, 'store']);
//     Route::get('/service', [ServiceController::class, 'index']);
//     Route::post('/service', [ServiceController::class, 'store']);

// });

Route::controller(AgenceCommercialsController::class)->prefix("Interim")->group(function(){
    Route::Post('/agence_commercials',"store");
});


Route::controller(AgenceController::class)->prefix("Interim")->group(function(){
    Route::Post('/agences',"store");
});


Route::controller(CategorieController::class)->prefix("Interim")->group(function(){
    Route::Post('/categories',"store");
});

Route::controller(ContratController::class)->prefix("Interim")->group(function(){
    Route::Post('/contrats',"store");
});


Route::controller(DepartementController::class)->prefix("Interim")->group(function(){
    Route::Post('/departements',"store");
});


Route::controller(DirectionController::class)->prefix("Interim")->group(function(){
    Route::Post('/directions',"store");
});



Route::controller(LocalController::class)->prefix("Interim")->group(function(){
    Route::Post('/locals',"store");
});


Route::controller(PoleController::class)->prefix("Interim")->group(function(){
    Route::Post('/poles',"store");
});


Route::controller(PosteController::class)->prefix("Interim")->group(function(){
    Route::Post('/postes',"store");
});


Route::controller(RemplacementsController::class)->prefix("Interim")->group(function(){
    Route::Post('/remplacements',"store");
});


Route::controller(RoleController::class)->prefix("Interim")->group(function(){
    Route::Post('/roles',"store");
});


Route::controller(ServiceController::class)->prefix("Interim")->group(function(){
    Route::Post('/services',"store");
});


Route::controller(UserController::class)->prefix("Interim")->group(function(){
    Route::Post('/users',"store");
    Route::Post('/interims',"store");
    Route::Post('/responsables',"store");
});


// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
