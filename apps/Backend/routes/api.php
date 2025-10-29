<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CartController;

// -------- Public (ไม่ต้อง login) --------
Route::get('/hello', fn () => response()->json(['message' => 'hello']));
Route::post('register', [AuthController::class, 'register']);
Route::post('login',    [AuthController::class, 'login']);
// ถ้าอยากให้ profile เป็น private ให้ย้ายไปอยู่ในกลุ่ม auth ด้านล่าง
// Route::get('profile', [AuthController::class, 'profile']); // (ไม่แนะนำให้เปิด public)
Route::apiResource('products', ProductController::class)->only(['index','show']);

// -------- Authenticated (ต้อง login) --------
Route::middleware(['auth:sanctum'])->group(function () {

    // Current user info (ให้ FE ใช้ endpoint นี้)
    Route::get('me', function (Request $request) {
        $u = $request->user();
        return response()->json([
            'id'   => $u->id,
            'name' => $u->name,
            'role' => $u->role ?? 'user',
        ]);
    });

    // ถ้าต้องการ profile แบบละเอียดและเป็น private
    Route::get('profile', [AuthController::class, 'profile']);

    // ออกจากระบบ
    Route::get('logout', [AuthController::class, 'logout']);

    // Users/Promotions (ตัวอย่าง)
    Route::get('users',       [UserController::class, 'showUser']);
    Route::get('promotions',  [PromotionController::class, 'index']);
    Route::get('updatePro',   [PromotionController::class, 'update']);

    // Orders (ของผู้ใช้ที่ล็อกอิน)
    Route::get(  'orders',         [OrderController::class, 'index']);
    Route::patch('orders/{order}', [OrderController::class, 'updateStatus']); // body: {status}

    Route::get('orders/{order}/products', [OrderController::class, 'products']);

    // Cart
    Route::prefix('cart')->group(function () {
        Route::post('/add',      [CartController::class, 'addToCart']);
        Route::get( '/',         [CartController::class, 'getCart']);
        Route::post('/checkout', [CartController::class, 'checkout']);
    });
});

// -------- Admin only --------
Route::middleware(['auth:sanctum', 'checkRole:admin'])->group(function () {
    Log::info('admin');
    Route::get('admin-test', [AdminController::class, 'test']);
});

// -------- Product detail by id (public) --------
use App\Http\Controllers\DetailProductController;
Route::get('/products/{productId}/detail', [DetailProductController::class, 'show']);
