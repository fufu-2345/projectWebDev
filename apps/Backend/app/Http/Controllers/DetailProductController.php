<?php
    namespace App\Http\Controllers ;
    use Illuminate\Http\Request ;
    use App\Models\Order ;
    use App\Models\Item ;
    use App\Models\Product ;

    class DetailProductController extends Controller{
        public function show($productId){
            $product = Product::findOrFail($productId) ;
            $items = Item::where('product_id',$productId)->where('stock', '!=', -1000) ->with('order')->get();
            $product->banner_image = $product->banner_image ? asset("storage/" . $product->banner_image):null;
            return response()->json([
                'statys' => true,
                'product' => $product,
                'items'=>$items
            ]);

        }

    }
?>
