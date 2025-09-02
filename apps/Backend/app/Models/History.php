<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class history extends Model
{
    protected $fillable =[
        "history_id",
        "history_totalprice",
        "history_datetime",
        "order_id",
        "customer_id"
    ];
}
