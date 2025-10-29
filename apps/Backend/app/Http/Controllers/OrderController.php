<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Order;

class OrderController extends Controller
{
    /**
     * GET /api/orders
     * คืนรายการออเดอร์ของผู้ใช้ที่ล็อกอินอยู่
     * โดย alias created_at -> datetime ให้ตรงกับ Frontend
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $orders = DB::table('orders')
            ->select([
                'id',
                DB::raw('created_at as datetime'),   // alias ให้มีฟิลด์ datetime
                'totalprice',
                'promotion',
                'status',
                'user_id',
                'created_at',
                'updated_at',
            ])
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'status' => true,
            'orders' => $orders,
        ]);
    }

    /**
     * PATCH /api/orders/{order}
     * เปลี่ยนสถานะคำสั่งซื้อ (payment -> shipping -> completed)
     */
    public function updateStatus(Request $request, Order $order)
    {
        // ป้องกันแก้ของคนอื่น (ถ้าไม่ได้ใช้ policy)
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['status' => false, 'message' => 'Forbidden'], 403);
        }

        // สถานะที่ UI ส่งมา: payment | shipping | success
        // DB enum: in cart | wait payment | shipping | completed
        $request->validate([
            'status' => 'required|string',
        ]);

        $incoming = strtolower(trim($request->input('status')));

        // normalize ให้ตรง enum DB
        $map = [
            'payment'  => 'payment',    // ถ้าอยากเก็บคำนี้จริง ๆ ต้องปรับ enum ใน DB ด้วย
            'shipping' => 'shipping',
            'success'  => 'completed',
            'complete' => 'completed',
            'completed'=> 'completed',
        ];

        // ถ้าใช้ enum ปัจจุบันตาม migration: ['in cart','wait payment','shipping','completed']
        // และอยากให้ 'payment' จาก UI ไปเป็น 'wait payment' ใน DB ให้ใช้แบบนี้แทน:
        if ($incoming === 'payment') {
            $dbStatus = 'wait payment';
        } elseif ($incoming === 'shipping') {
            $dbStatus = 'shipping';
        } elseif (in_array($incoming, ['success','complete','completed'], true)) {
            $dbStatus = 'completed';
        } else {
            return response()->json(['status' => false, 'message' => 'Invalid status'], 422);
        }

        $order->status = $dbStatus;
        $order->save();

        // คืน payload ให้มี datetime เช่นเดียวกับ index()
        $payload = [
            'id'         => $order->id,
            'datetime'   => $order->created_at,   // alias
            'totalprice' => $order->totalprice,
            'promotion'  => $order->promotion,
            'status'     => $order->status,
            'user_id'    => $order->user_id,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
        ];

        return response()->json([
            'status' => true,
            'order'  => $payload,
        ]);
    }

    public function products(Request $request, Order $order)
    {
        // ป้องกันแก้ของคนอื่น
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['status' => false, 'message' => 'Forbidden'], 403);
        }

        // join items + products เพื่อได้ title / cost
        $rows = DB::table('items')
            ->join('products', 'products.id', '=', 'items.product_id')
            ->where('items.order_id', $order->id)
            ->get([
                'items.product_id',
                'items.quantity',
                'products.title',
                'products.cost',
            ]);

        $items = $rows->map(function ($r) {
            return [
                'product_id' => (int) $r->product_id,
                'quantity'   => (int) $r->quantity,
                'title'      => $r->title,
                'price'      => (float) $r->cost,
            ];
        })->values();

        return response()->json([
            'status' => true,
            'items'  => $items,
        ]);
    }
}
