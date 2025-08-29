<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class order extends Model
{
    protected $fillable =[
        "order_id",
        "order_product",
        "order_datetime",
        "order_totalprice",
        "order_promotion",
        "order_status",
        "customer_id"
    ];
}
