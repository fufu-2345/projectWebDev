<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;
// use App\Http\Middleware\CheckRole;

class Kernel extends HttpKernel
{
    protected $middleware = [
    ];

    protected $middlewareGroups = [
    ];

    protected $routeMiddleware = [
        'checkRole' => \App\Http\Middleware\CheckRole::class,
    ];
}
