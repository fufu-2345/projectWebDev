<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class order extends Model
{
    protected $fillable =[
        "datetime",
        "totalprice",
        "order_datetime",
        "promotion",
        "status",
        "order_status",
        "user_id"
    ];


    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
