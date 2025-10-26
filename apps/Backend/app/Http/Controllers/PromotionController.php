<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Models\Promotion;

class PromotionController extends Controller
{
    public function index(Request $request)
    {
        log::info('promotion/index');
        $id = $request->query('id');
        $query = Promotion::query();
        if($id){
            $query->where("id", $id);
        }

        $promotion = $query->get()->map(function($promotion){
            return $promotion;
        });

        return response()->json([
            "status" => true,
            "promotion" => $promotion
        ]);
    }

    /*public function update(Request $request, Product $product)
    public function update(Request $request)
    {
        $data = $request -> validate([
            "title" => "required"
        ]);
        $category = isset($request->category) ? $request->category : $product->category;
        $data["cost"] = isset($request->cost) ? $request->cost : $product->cost;

        if($request->hasFile("banner_image")){
            if($product->banner_image){
                Storage::disk("public")->delete($product->banner_image);
            }

            $data["banner_image"] = $request->file("banner_image")->store("products","public");
        }
        $promotion->update($data);

        return response()->json([
            "status" => true,
            "message" => "Product data updated"
        ]);
    }*/

}
