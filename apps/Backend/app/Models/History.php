<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class history extends Model
{
    protected $fillable =[
        "totalprice",
        "items",
        "user_id"
    ];
}
