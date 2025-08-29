<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->string('customer_id')->primary();
            $table->string('customer_email')->unique();
            $table->text('customer_password');
            $table->text('customer_name');
            $table->enum('customer_role', ['user', 'admin'])->default('user');
            $table->text('customer_profilepic')->nullable();
            $table->text('customer_address')->nullable();
            $table->text('customer_phone_number')->nullable();
            $table->date('customer_birthday')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
