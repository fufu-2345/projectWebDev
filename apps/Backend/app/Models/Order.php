<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
   protected $fillable = [
    "totalprice",
    "promotion",
    "status",
    "user_id"
];


    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
