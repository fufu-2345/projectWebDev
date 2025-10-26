<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return 'hello';
});

Route::middleware('web')->get('/get-role', function () {
    return response()->json([
        'role' => session('user_role'),
        'id' => session('user_id')
    ]);
});
