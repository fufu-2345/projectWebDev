"use client";

import React, { useState, useEffect } from "react";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import { Chart } from "chart.js";
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
  const [baseOn, setBaseOn] = useState<string>("user"); // user or product or category
  const [categories, setCategories] = useState<Category>(Category.All);
  const [data, setData] = useState<any[]>([]);

  if (isLoading) {
    return <Loader />;
  }

  useEffect(() => {
    if (!authToken || role === "user") {
      router.back();
    }
    fetchData();
  }, [authToken, role]);

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
  const fetchData = async () => {
    try {
      let type = "";
      if (baseOn === "user") {
        type = "getUserOrderSummary";
      } else if (baseOn === "product") {
        type = "getProductSummary";
      } else if (baseOn === "category") {
        type = "getCategorySummary";
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/${type}`,
        {
          params: { category: categories },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOptionChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategories(event.target.value as Category);
    fetchData();
  };

  const handleCategoryChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setBaseOn(event.target.value);
    try {
      let type = "";
      if (event.target.value === "user") {
        type = "getUserOrderSummary";
      } else if (event.target.value === "product") {
        type = "getProductSummary";
      } else if (event.target.value === "category") {
        type = "getCategorySummary";
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/${type}`,
        {
          params: { category: categories },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <br />
      <select onChange={handleCategoryChange} value={baseOn}>
        <option value="user">User</option>
        <option value="product">Product</option>
        <option value="category">Product Category</option>
      </select>

      {baseOn === "product" && (
        <>
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
        </>
      )}
      <br />
      <br />

      <div className="flex items-center justify-center">
        {baseOn === "category" && (
          <table className="border border-black">
            <thead>
              <tr className="border border-black">
                <th className="border border-black px-4 py-2">Category</th>
                <th className="border border-black px-4 py-2">
                  Total Quantity
                </th>
                <th className="border border-black px-4 py-2">Total Price</th>
                <th className="border border-black px-4 py-2">Total Order</th>
              </tr>
            </thead>
            {data.map((dataa, index) => (
              <tr key={index} className="border border-black">
                <td className="border border-black px-4 py-2">
                  {dataa.Category}
                </td>
                <td className="border border-black px-4 py-2">
                  {dataa.TotalQuantity}
                </td>
                <td className="border border-black px-4 py-2">
                  {dataa.TotalPrice}
                </td>
                <td className="border border-black px-4 py-2">
                  {dataa.TotalOrder}
                </td>
              </tr>
            ))}
          </table>
        )}

        {baseOn === "user" && (
          <table className="border border-black">
            <thead>
              <tr className="border border-black">
                <th className="border border-black px-4 py-2">Username</th>
                <th className="border border-black px-4 py-2">
                  Total Quantity
                </th>
                <th className="border border-black px-4 py-2">Total Price</th>
                <th className="border border-black px-4 py-2">Total Order</th>
              </tr>
            </thead>
            {data.map((dataa, index) => (
              <tr key={index} className="border border-black">
                <td className="border border-black px-4 py-2">
                  {dataa.Username}
                </td>
                <td className="border border-black px-4 py-2">
                  {dataa.TotalQuantity}
                </td>
                <td className="border border-black px-4 py-2">
                  {dataa.TotalPrice}
                </td>
                <td className="border border-black px-4 py-2">
                  {dataa.TotalOrder}
                </td>
              </tr>
            ))}
          </table>
        )}

        {baseOn === "product" && (
          <table className="border border-black">
            <thead>
              <tr className="border border-black">
                <th className="border border-black px-4 py-2">product</th>
                <th className="border border-black px-4 py-2">
                  Total Quantity
                </th>
                <th className="border border-black px-4 py-2">Total Price</th>
                <th className="border border-black px-4 py-2">Total Order</th>
              </tr>
            </thead>
            {data.map((dataa, index) => (
              <tr key={index} className="border border-black">
                <td className="border border-black px-4 py-2">
                  {dataa.Productname}
                </td>
                <td className="border border-black px-4 py-2">
                  {dataa.TotalQuantity}
                </td>
                <td className="border border-black px-4 py-2">
                  {dataa.TotalPrice}
                </td>
                <td className="border border-black px-4 py-2">
                  {dataa.TotalOrder}
                </td>
              </tr>
            ))}
          </table>
        )}
      </div>
    </>
  );
};

export default Dashboard;
