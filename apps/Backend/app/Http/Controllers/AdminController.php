<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
}
