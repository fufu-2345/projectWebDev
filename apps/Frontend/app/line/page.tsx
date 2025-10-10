"use client";

import React, { useState, useEffect } from "react";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import axios from "axios";

enum Category {
  Pencil = "Pencil",
  Eraser = "Eraser",
  Ruler = "Ruler",
  Pen = "Pen",
  Liquid = "Liquid",
  Paint = "Paint",
  All = "",
}

const Dashboard: React.FC = () => {
  const { isLoading, authToken, role } = myAppHook();
  const router = useRouter();
  const [graph, setGraph] = useState<string>("amout"); // amount or cost
  const [baseOn, setBaseOn] = useState<string>("user"); // user or product
  const [categories, setCategories] = useState<Category>(Category.All);
  const [products, setProducts] = useState<ProductType[]>([]);

  if (isLoading) {
    return <Loader />;
  }

  useEffect(() => {
    if (!authToken) {
      router.push("/auth");
      return;
    }
    fetchGraph();
  }, [authToken]);

  interface ProductType {
    id?: number;
    title: string;
    category: Category;
    cost: number;
    stock: number;
    file?: string;
    banner_image?: File | null;
  }

  // List all products
  const fetchGraph = async () => {
    try {
      // const response = await axios.get(
      //   `${process.env.NEXT_PUBLIC_API_URL}/products`,
      //   {
      //     params: { category: categories },
      //     headers: {
      //       Authorization: `Bearer ${authToken}`,
      //     },
      //   }
      // );
    } catch (error) {
      console.log(error);
    }
  };

  const handleOptionChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategories(event.target.value as Category);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          params: { category: event.target.value },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <select onChange={(e) => setGraph(e.target.value)} value={graph}>
        <option value="amout">Amount</option>
        <option value="cost">Cost</option>
      </select>
      <select onChange={(e) => setBaseOn(e.target.value)} value={baseOn}>
        <option value="user">User</option>
        <option value="product">Product</option>
      </select>

      <select
        className="form-input mb-4 p-3 w-full border border-gray-300 rounded-md"
        value={categories}
        onChange={handleOptionChange}
      >
        <option value={Category.All}>All Product</option>
        <option value={Category.Pencil}>Pencil</option>
        <option value={Category.Eraser}>Eraser</option>
        <option value={Category.Ruler}>Ruler</option>
        <option value={Category.Pen}>Pen</option>
        <option value={Category.Liquid}>Liquid</option>
        <option value={Category.Paint}>Paint</option>
      </select>
      <div
        onClick={() => {
          console.log(graph, baseOn);
        }}
      >
        test
      </div>
    </>
  );
};

export default Dashboard;
