"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { myAppHook } from "@/context/AppProvider";

interface Product {
  id: number;
  title: string;
  banner_image: string;
  cost: number;
  category: string;
  stock: number;
  user_id?: number;
}

interface Order {
  id: number;
  datetime: string;
  totalprice: number;
  promotion: string;
  status: string;
  user_id: number;
}

interface Item {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  order: Order;
}

interface Props {
  params: { productId: string };
}

const Page: React.FC<Props> = ({ params }) => {
  const productId = params.productId;
  const router = useRouter();
  const { authToken } = myAppHook(); // ✅ ดึง token จาก hook

  const [product, setProduct] = useState<Product | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/products/${productId}`);
        const data = await res.json();
        if (data.status) setProduct(data.products);

        const resItems = await fetch(`http://localhost:8000/api/items?product_id=${productId}`);
        const dataItems = await resItems.json();
        if (dataItems.status) setItems(dataItems.items);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;

    const token = authToken;
    if (!token) {
      alert("Please login first!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity,
        }),
      });

      const data = await res.json();
      if (data.status) {
        alert("Add Successful");
      } else {
        alert("Add To Cart: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error Can not add to cart");
    }
  };

  const handleGoToCart = () => {
    if (!authToken) {
      alert("Please login first!");
      return;
    }
    router.push("/cart"); // ✅ ไปหน้า cart
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <h1>{product.title}</h1>
      {product.banner_image && (
        <img src={product.banner_image} alt={product.title} width={200} />
      )}
      <p>Category: {product.category}</p>
      <p>Cost: {product.cost}</p>
      <p>Stock: {product.stock}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-2 py-1 bg-gray-300 rounded"
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="px-2 py-1 bg-gray-300 rounded"
        >
          +
        </button>
      </div>
      <button
        onClick={handleAddToCart}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Add to Cart
      </button>
      <button
        onClick={handleGoToCart} // ✅ ปุ่ม Cart ไปหน้า cart
        className="px-4 py-2 bg-green-500 text-white rounded-md ml-2"
      >
        Cart
      </button>
    </div>
  );
};

export default Page;
