<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CheckRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        Log::info('CheckRole middleware is running');
        $user = Auth::user();
        Log::info('Expected role: ' . $role);
        Log::info("CheckRole", ['user' => $user]);
        if (!$user || $user->role !== $role) {
            return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
        }
        return $next($request);
    }
}
