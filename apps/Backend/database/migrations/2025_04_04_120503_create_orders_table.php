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
        Schema::create('orders', function (Blueprint $table) {
            $table->string('order_id')->primary();
            $table->json('order_product');
            $table->dateTime('order_datetime');
            $table->float('order_totalprice');
            $table->text('order_promotion')->nullable();
            $table->enum('order_status', ['in cart', 'wait', 'payment', 'shipping', 'complete'])->default('in cart');
            $table->string('customer_id');

            $table->foreign('customer_id')->references('customer_id')->on('customers')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
