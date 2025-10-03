<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    //Register API
    public function register(Request $request){
        log::info('auth/register');
        $data = $request->validate([
            "name" => "required|string",
            "email" => "required|email|unique:users,email",
            "password" => "required|confirmed"
        ]);

        // password confirmation

        User::create($data);

        return response()->json([
            "status" => true,
            "message" => "User registered successfully"
        ]);
    }

    //Login API
    public function login(Request $request){
        log::info('auth/login');
        $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);

        if(!Auth::attempt($request->only("email","password"))){
            return response()->json([
                "status" => false,
                "message" => "Invalid Credentials"
            ]);
        }

        $user = Auth::user();
        //$user->createToken("myToken")->plainTextToken;
        $token = $user->createToken("myToken")->plainTextToken;

        return response()->json([
            "status" => true,
            "message" => "User logged in",
            "token" => $token,
            "role" => $user->role
        ]);
    }

    //Profile API
    public function profile(Request $request){
        log::info('auth/profile');
        $id = $request->query('id');
        $query = User::query();
        if($id){
            $query->where("id", $id);
        }

        $user = $query->get()->map(function($user){
            return $user;
        });

        return response()->json([
            "status" => true,
            "user" => $user
        ]);
    }

    //Logout API
    public function logout(){
        Auth::logout();
        return response()->json([
            "status" => true,
            "message" => "User logged out successfully"
        ]);
    }
}
