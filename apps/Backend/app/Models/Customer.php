<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class customer extends Model
{
    protected $fillable =[
        "customer_id",
        "customer_email",
        "customer_password",
        "customer_name",
        "customer_role",
        "customer_profilepic",
        "customer_address",
        "customer_phone_number",
        "customer_birthday"
    ];
}
