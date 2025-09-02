<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class promotion extends Model
{
    protected $fillable =[
        "promotion_id",
        "promotion_discount"
    ];
}
