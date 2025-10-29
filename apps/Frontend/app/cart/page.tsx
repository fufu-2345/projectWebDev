"use client";
import React, { useEffect, useState } from "react";
import { myAppHook } from "@/context/AppProvider";

interface Product {
  id: number;
  title: string;
  cost: number;
  stock: number;
}

interface Item {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

interface Order {
  id: number;
  totalprice: number;
  status: string;
  items: Item[];
}

const Page: React.FC = () => {
  const { authToken, isLoading: authLoading } = myAppHook();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 โหลดข้อมูล cart
  const fetchCart = async () => {
    if (!authToken) return;
    try {
      const res = await fetch("http://localhost:8000/api/cart", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.status) setOrder(data.cart);
      else setOrder(null);
    } catch (err) {
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [authToken]);

  // 🔹 เปลี่ยนจำนวนสินค้า
  const handleQuantityChange = async (itemId: number, newQuantity: number, stock: number) => {
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > stock) newQuantity = stock;

    try {
      const res = await fetch("http://localhost:8000/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ item_id: itemId, quantity: newQuantity }),
      });
      const data = await res.json();
      if (data.status) fetchCart();
      else alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Error updating quantity");
    }
  };

  // 🔹 ลบสินค้าออกจากตะกร้า
  const handleDelete = async (itemId: number) => {
    try {
      const res = await fetch("http://localhost:8000/api/cart/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ item_id: itemId }),
      });
      const data = await res.json();
      if (data.status) fetchCart();
      else alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Error deleting item");
    }
  };

  // 🔹 Checkout สั่งซื้อ
  const handleCheckout = async () => {
    if (!authToken) {
      alert("Please login first!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/cart/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      console.log("Checkout result:", data);

      if (data.status) {
        alert("Order placed successfully! Total: $" + data.totalprice);
        setOrder(null); // ล้าง cart
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Checkout failed!");
    }
  };

  // 🔹 รวมราคาสินค้าทั้งหมด
  const calculateTotal = () =>
    order?.items?.reduce((acc, item) => acc + item.quantity * item.product.cost, 0) || 0;

  // 🔹 Loading หรือไม่มีสินค้า
  if (loading || authLoading) return <p>Loading cart...</p>;
  if (!order || !order.items || order.items.length === 0)
    return <p>Your cart is empty</p>;

  // 🔹 แสดงรายการสินค้า
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="p-2 border">{item.product.title}</td>
              <td className="p-2 border">${item.product.cost}</td>
              <td className="p-2 border">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1, item.product.stock)
                    }
                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.id,
                        parseInt(e.target.value) || 1,
                        item.product.stock
                      )
                    }
                    className="w-16 px-2 py-1 border rounded text-center"
                  />
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1, item.product.stock)
                    }
                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500">Stock: {item.product.stock}</p>
              </td>
              <td className="p-2 border">
                ${item.quantity * item.product.cost}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-xl font-semibold">Total: ${calculateTotal()}</p>
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
