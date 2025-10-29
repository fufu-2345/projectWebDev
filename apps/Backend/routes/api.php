<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Middleware\CheckRole;

use App\Http\Controllers\TestController;
Route::get('/hello', function () {
    return response()->json(['message' => 'hello']);
});

Route::post("register", [AuthController::class, "register"]);
Route::post("login", [AuthController::class, "login"]);
Route::get("profile", [AuthController::class, "profile"]);
Route::apiResource("products", ProductController::class);
Route::get('user/profile', [ProfileController::class, 'show']);

/*  ส่งความคืบหน้าครั้งที่ 2
Route::get("getShippingOrders", [AdminController::class, "getShippingOrders"]);
Route::get("getCategorySummary", [AdminController::class, "getCategorySummary"]);
Route::get("getUserOrderSummary", [AdminController::class, "getUserOrderSummary"]);
Route::get("getProductSummary", [AdminController::class, "getProductSummary"]);
*/

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

    Route::get('profile', [ProfileController::class, 'show']);
    Route::post('profile', [ProfileController::class, 'update']);

    Route::get("updatePro", [PromotionController::class, "update"]);

    // Route::apiResource("products", ProductController::class);
    // Route::get('admin-test', [AdminController::class, 'test']);
});


Route::middleware(['auth:sanctum', 'checkRole:admin'])->group(function () {
    Log::info("admin");
    Route::get('admin-test', [AdminController::class, 'test']);
});

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


use App\Http\Controllers\DetailProductController ;
Route::get('/products/{productId}/detail',[DetailProductController::class,'show']);


use App\Http\Controllers\CartController;

Route::middleware(['auth:sanctum'])->group(function() {
    Route::prefix('cart')->group(function(){
        Route::get('/', [CartController::class, 'getCart']);
        Route::post('/add', [CartController::class, 'addToCart']);
        Route::post('/update', [CartController::class, 'updateQuantity']);
        Route::post('/delete', [CartController::class, 'deleteItem']);
        Route::post('/checkout', [CartController::class, 'checkout']);
    });
});





