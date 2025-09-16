<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return 'hello';
});

// Route::get('/', function () {
//     return response()->json(["status" => true, "message" => "User registered successfully"]);
// });
