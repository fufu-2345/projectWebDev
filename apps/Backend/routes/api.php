<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\TestController;
Route::get('/hello', function () {
    return response()->json(['message' => 'hello']);
});
Route::get('/', function () {
    return response()->json(['message' => '////////////////////']);
});

Route::post("register", [AuthController::class, "register"]);
Route::post("login", [AuthController::class, "login"]);

Route::group([
    "middleware" => ["auth:sanctum"]
], function(){

    Route::get("profile", [AuthController::class, "profile"]);
    Route::get("logout", [AuthController::class, "logout"]);
});


// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
