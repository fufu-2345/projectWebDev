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

}
