<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\AdminController;
use App\Http\Middleware\CheckRole;

use App\Http\Controllers\TestController;
Route::get('/hello', function () {
    return response()->json(['message' => 'hello']);
});

Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf_token' => csrf_token()])
        ->withCookie(cookie('XSRF-TOKEN', csrf_token(), 120));
});

Route::middleware(['web'])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/session', function () {
        return response()->json([
            'role' => Session::get('user_role'),
            'id' => Session::get('user_id'),
            'session_id' => Session::getId()
        ]);
    });
});

Route::post("register", [AuthController::class, "register"]);
Route::get("profile", [AuthController::class, "profile"]);
Route::apiResource("products", ProductController::class);

// ส่งความคืบหน้าครั้งที่ 2
Route::get("getShippingOrders", [AdminController::class, "getShippingOrders"]);
Route::get("getCategorySummary", [AdminController::class, "getCategorySummary"]);
Route::get("getUserOrderSummary", [AdminController::class, "getUserOrderSummary"]);
Route::get("getProductSummary", [AdminController::class, "getProductSummary"]);

// ใน group คือพวกที่ต้อง login แล้วเท่านั้น
// ถ้าใครจะทดสอบ api ใน postman ให้ลองข้างนอก
// หรือ api ที่ใช้งานตอนยังไม่ได้ login ให้ใส่ข้างนอกหมดเลย เหมือน /hello register login ข้างบน
Route::group([
    "middleware" => ["auth:sanctum"]
], function(){
    Route::get("profile", [AuthController::class, "profile"]);
    Route::get("logout", [AuthController::class, "logout"]);
    Route::get("users", [UserController::class, "showUser"]);
    Route::get("promotions", [PromotionController::class, "index"]);
    Route::post("updatePromotions", [PromotionController::class, "update"]);
    Route::get("updatePro", [PromotionController::class, "update"]);

    // Route::apiResource("products", ProductController::class);
});


use App\Http\Controllers\DetailProductController ;
Route::get('/products/{productId}/detail',[DetailProductController::class,'show']);


use App\Http\Controllers\CartController ;
Route::group([
    'middleware' => ['auth:sanctum']
], function() {
    Route::prefix('cart')->group(function(){
        Route::post('/add', [CartController::class, 'addToCart']);
        Route::get('/', [CartController::class, 'getCart']);
        Route::post('/checkout', [CartController::class, 'checkout']);
    });
});
