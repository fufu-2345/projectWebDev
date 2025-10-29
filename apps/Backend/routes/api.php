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
use App\Http\Controllers\ProfileController;
use App\Http\Middleware\CheckRole;

// -------- Public (ไม่ต้อง login) --------
Route::get('/hello', function () {
    return response()->json(['message' => 'hello']);
});
Route::post("register", [AuthController::class, "register"]);
Route::post("login", [AuthController::class, "login"]);

// ถ้าอยากให้ profile เป็น private ให้ย้ายไปอยู่ในกลุ่ม auth ด้านล่าง
// Route::get('profile', [AuthController::class, 'profile']); // (ไม่แนะนำให้เปิด public)

// products (คงเวอร์ชันเต็มจากไฟล์ที่สอง, เอาเวอร์ชัน only(['index','show']) ออกเพราะซ้ำ)
Route::apiResource("products", ProductController::class);

// เพิ่มเติมจากไฟล์ที่สอง: โปรไฟล์ผู้ใช้แยก controller
Route::get('user/profile', [ProfileController::class, 'show']);

/*  ส่งความคืบหน้าครั้งที่ 2
Route::get("getShippingOrders", [AdminController::class, "getShippingOrders"]);
Route::get("getCategorySummary", [AdminController::class, "getCategorySummary"]);
Route::get("getUserOrderSummary", [AdminController::class, "getUserOrderSummary"]);
Route::get("getProductSummary", [AdminController::class, "getProductSummary"]);
*/

// -------- Product detail by id (public) --------
use App\Http\Controllers\DetailProductController ;
Route::get('/products/{productId}/detail',[DetailProductController::class,'show']);

// -------- Authenticated (ต้อง login) --------
// ใน group คือพวกที่ต้อง login แล้วเท่านั้น
// ถ้าใครจะทดสอบ api ใน postman ให้ลองข้างนอก
// หรือ api ที่ใช้งานตอนยังไม่ได้ login ให้ใส่ข้างนอกหมดเลย เหมือน /hello register login ข้างบน
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
    Route::get("profile", [AuthController::class, "profile"]);

    // ออกจากระบบ
    Route::get("logout", [AuthController::class, "logout"]);

    // Users/Promotions (ตัวอย่าง)
    Route::get("users", [UserController::class, "showUser"]);
    Route::get("promotions", [PromotionController::class, "index"]);
    Route::get("updatePro", [PromotionController::class, "update"]);

    // Orders (ของผู้ใช้ที่ล็อกอิน)
    Route::get('orders',                 [OrderController::class, 'index']);
    Route::patch('orders/{order}',       [OrderController::class, 'updateStatus']); // body: {status}
    Route::get('orders/{order}/products',[OrderController::class, 'products']);

    // Cart (คงชุดเต็มจากไฟล์ที่สอง; ของไฟล์แรกมีเฉพาะ add/get/checkout)
    Route::prefix('cart')->group(function(){
        Route::get('/',         [CartController::class, 'getCart']);
        Route::post('/add',     [CartController::class, 'addToCart']);
        Route::post('/update',  [CartController::class, 'updateQuantity']);
        Route::post('/delete',  [CartController::class, 'deleteItem']);
        Route::post('/checkout',[CartController::class, 'checkout']);
    });

    // NOTE: ลบเส้นทางซ้ำกันของ ProfileController ภายใน auth group:
    // Route::get('profile', [ProfileController::class, 'show']);
    // Route::post('profile', [ProfileController::class, 'update']);
});

// -------- Admin only --------
Route::middleware(['auth:sanctum', 'checkRole:admin'])->group(function () {
    Log::info("admin");
    Route::get('admin-test', [AdminController::class, 'test']);
});

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
