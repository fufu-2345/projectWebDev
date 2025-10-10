"use client";

import React, { useState, useEffect, use } from "react";
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

interface Props {
  params: Promise<{ productId: string }>;
}

const Page: React.FC<Props> = ({ params }) => {
  const { productId } = use(params);
  const router = useRouter();
  const { authToken } = myAppHook();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/products/${productId}/detail`);
        const data = await res.json();
        if (data.statys) setProduct(data.product);
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

    if (quantity > product.stock) {
      alert(`Cannot add more than ${product.stock} items to cart.`);
      return;
    }

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
        alert("Added to cart successfully!");
      } else {
        alert("Add to cart failed: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error: cannot add to cart");
    }
  };

  const handleGoToCart = () => {
    if (!authToken) {
      alert("Please login first!");
      return;
    }
    router.push("/cart");
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value) || 1; 
    if (product) {
      if (value > product.stock) value = product.stock;
      if (value < 1) value = 1;
    }
    setQuantity(value);
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!product)
    return (
      <p className="text-center mt-10 text-red-500">Product not found</p>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8 bg-white shadow-lg rounded-lg p-6">
        {/* Image */}
        <div className="md:w-1/2 flex justify-center items-center">
          {product.banner_image ? (
            <img
              src={product.banner_image}
              alt={product.title}
              className="rounded-lg max-h-96 object-contain"
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
              No Image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Category:</span> {product.category}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Cost:</span> ${product.cost}
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-semibold">Stock:</span> {product.stock}
            </p>

            {/* Quantity selector */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 px-2 py-1 border rounded text-center"
                min={1}
                max={product.stock}
              />
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                +
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={quantity > product.stock} // ปิดปุ่มถ้าเกิน stock
                className={`px-4 py-2 rounded-md text-white transition ${
                  quantity > product.stock
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Add to Cart
              </button>
              <button
                onClick={handleGoToCart}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
