"use client";
import React, { useEffect, useState } from "react";
import { myAppHook } from "@/context/AppProvider"; // ใช้ hook ของคุณ

interface Product {
  id: number;
  title: string;
  cost: number;
  banner_image?: string;
}

interface Item {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

interface Order {
  id: number;
  datetime: string;
  totalprice: number;
  promotion: string | null;
  status: string;
  items: Item[];
}

const Page: React.FC = () => {
  const { authToken, isLoading: authLoading } = myAppHook();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (!authToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/api/cart", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await res.json();
        if (data.status) setOrder(data.cart);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [authToken]);

  const handleCheckout = async () => {
    if (!authToken) {
      alert("Please login first!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/cart/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.status) {
        alert("Order placed successfully!");

        const resCart = await fetch("http://localhost:8000/api/cart", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const cartData = await resCart.json();
        if (cartData.status) setOrder(cartData.cart);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Checkout failed!");
    }
  };

  const calculateTotal = () => {
    if (!order || !order.items) return 0;
    return order.items.reduce(
      (acc, item) => acc + item.quantity * item.product.cost,
      0
    );
  };

  if (loading || authLoading) return <p>Loading cart...</p>;
  if (!order || order.items.length === 0) return <p>Your cart is empty</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="p-2 border">{item.product.title}</td>
              <td className="p-2 border">{item.product.cost}</td>
              <td className="p-2 border">{item.quantity}</td>
              <td className="p-2 border">
                {item.quantity * item.product.cost}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-xl font-semibold">Total: {calculateTotal()}</p>
        <button
          onClick={handleCheckout}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Page;
