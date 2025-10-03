<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Item;

class CartController extends Controller {

    // Add to cart
    public function addToCart(Request $request) {
        $request->validate([
            'product_id' => 'required|integer',
            'quantity'   => 'required|integer|min:1',
        ]);

        $user = $request->user(); 

        $order = Order::firstOrCreate(
            ['user_id' => $user->id, 'status' => 'in cart'],
            ['datetime' => now(), 'totalprice' => 0, 'promotion' => null]
        );

        $item = Item::where('order_id', $order->id)
                    ->where('product_id', $request->product_id)
                    ->first();

        if ($item) {
            $item->quantity += $request->quantity;
            $item->save();
        } else {
            Item::create([
                'order_id' => $order->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Item added to cart'
        ]);
    }

    // Get cart
    public function getCart(Request $request) {
        $user = $request->user(); // ใช้ token ดึง user

        $order = Order::with('items.product') // ต้อง join product
            ->where('user_id', $user->id)
            ->where('status', 'in cart')
            ->first();

        return response()->json(['status' => true, 'cart' => $order]);
    }

    // Checkout
    public function checkout(Request $request){
    $user = $request->user(); 

    $order = Order::with('items.product')->where('user_id', $user->id)
                ->where('status','in cart')
                ->first();

    if(!$order){
        return response()->json(['status'=>false,'message'=>'Cart not found']);
    }

    // cal total price
    $totalPrice = 0;
    foreach($order->items as $item){
        $product = $item->product;
        $totalPrice += $item->quantity * $product->cost;

        // update stock
        if($product->stock >= $item->quantity){
            $product->stock -= $item->quantity;
            $product->save();
        } else {
            return response()->json([
                'status' => false,
                'message' => "Insufficient stock for product: {$product->title}"
            ]);
        }
    }

    $order->totalprice = $totalPrice;
    $order->status = 'wait'; 
    $order->datetime = now(); 
    $order->save();

    return response()->json([
        'status'=>true,
        'message'=>'Order placed successfully',
        'totalprice' => $order->totalprice
    ]);
    }


}

?>