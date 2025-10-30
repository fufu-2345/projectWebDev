<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Product;
use App\Models\Item;
use App\Models\History;


class AdminController extends Controller
{
    public function index()
    {
        Log::info("Role from Route: " . $role);
Log::info("User's Role: " . $user->role);
        return response()->json([

            'message' => 'hello test test'
        ]);
    }

    public function test()
    {
        Log::info("Role from Route: " . $role);
        Log::info("User's Role: " . $user->role);
        Log::info('User from Auth:', [$user]);
        return response()->json([
            'message' => 'test test'
        ]);
    }


    /////// ส่งความคืบหน้าครั้งที่ 2
    public function getShippingOrders() //2
    {
        $orders = User::join('orders', 'users.id', '=', 'orders.user_id')
            ->join('items', 'orders.id', '=', 'items.order_id')
            ->where('orders.status', 'shipping')
            ->select(
                'users.id as user_id',
                'users.name as username',
                'orders.updated_at as order_at',
                'orders.totalprice as total_price',
                DB::raw('SUM(items.quantity) as quantity'),
                'users.address as address',
                'users.email as email',
                'users.phone as phone'
            )
            ->groupBy('orders.id')
            ->get();

        return response()->json($orders);
    }

    public function getCategorySummary() //3
    {
        $result = DB::table('items')
            ->join('products', 'items.product_id', '=', 'products.id')
            ->join('orders', 'items.order_id', '=', 'orders.id')
            ->select(
                'products.category as Category',
                DB::raw('SUM(items.quantity) as "TotalQuantity"'),
                DB::raw('SUM(orders.totalprice) as "TotalPrice"'),
                DB::raw('COUNT(DISTINCT orders.id) as "TotalOrder"')
            )
            ->where('orders.status', 'completed')
            ->whereBetween('orders.updated_at', ['2025-10-01 00:00:00', '2025-11-01 00:00:00'])
            ->groupBy('products.category')
            ->get();

        return $result;
    }

    public function getUserOrderSummary() //4
    {
        $result = DB::table('items')
            ->join('products', 'items.product_id', '=', 'products.id')
            ->join('orders', 'items.order_id', '=', 'orders.id')
            ->join('users', 'users.id', '=', 'orders.user_id') // เชื่อมโยงกับ users
            ->select(
                'users.name as Username',
                DB::raw('SUM(items.quantity) as "TotalQuantity"'),
                DB::raw('SUM(orders.totalprice) as "TotalPrice"'),
                DB::raw('COUNT(DISTINCT orders.id) as "TotalOrder"')
            )
            ->where('orders.status', 'completed')
            ->whereBetween('orders.updated_at', ['2025-10-01 00:00:00', '2025-11-01 00:00:00'])
            ->groupBy('users.name')
            ->get();

        return $result;
    }

    public function getProductSummary() //5
    {
        $result = DB::table('items')
            ->join('products', 'items.product_id', '=', 'products.id')
            ->join('orders', 'items.order_id', '=', 'orders.id')
            ->select(
                'products.title as Productname',
                DB::raw('sum(items.quantity) as "TotalQuantity"'),
                DB::raw('sum(orders.totalprice) as "TotalPrice"'),
                DB::raw('count(distinct orders.id) as "TotalOrder"')
            )
            ->where('orders.status', 'completed')
            ->whereBetween('orders.updated_at', ['2025-10-01 00:00:00', '2025-11-01 00:00:00'])
            ->groupBy('products.id')
            ->get();

        return $result;
    }

    ///////
}
