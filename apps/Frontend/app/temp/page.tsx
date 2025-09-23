"use client";

import React, { useState, useEffect } from "react";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import axios from "axios";

const Promotion: React.FC = () => {
  const { isLoading, authToken } = myAppHook();
  const router = useRouter();

  const [shippingOrders, setShippingOrders] = useState<any[]>([]);
  const [categorySummary, setCategorySummary] = useState<any[]>([]);
  const [UserOrderSummary, setUserOrderSummary] = useState<any[]>([]);
  const [productSummary, setProductSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  if (isLoading) {
    return <Loader />;
  }

  useEffect(() => {
    if (!authToken) {
      router.push("/auth");
      return;
    }
    fetchShippingOrders();
    fetchCategorySummary();
    fetchUserOrderSummary();
    fetchProductSummary();
  }, [authToken]);

  const fetchShippingOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/getShippingOrders",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setShippingOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchCategorySummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/getCategorySummary",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setCategorySummary(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchUserOrderSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/getUserOrderSummary",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setUserOrderSummary(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchProductSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/getProductSummary",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setProductSummary(response.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="container mx-auto my-8 px-4">
        <table className="min-w-full table-auto border border-black">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-black">User ID</th>
              <th className="px-4 py-2 border border-black">Username</th>
              <th className="px-4 py-2 border border-black">Order At</th>
              <th className="px-4 py-2 border border-black">Total Price</th>
              <th className="px-4 py-2 border border-black">Quantity</th>
              <th className="px-4 py-2 border border-black">Address</th>
              <th className="px-4 py-2 border border-black">Email</th>
              <th className="px-4 py-2 border border-black">Phone</th>
            </tr>
          </thead>
          <tbody>
            {shippingOrders.map((order, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border border-black">
                  {order.user_id}
                </td>
                <td className="px-4 py-2 border border-black">
                  {order.username}
                </td>
                <td className="px-4 py-2 border border-black">
                  {order.order_at}
                </td>
                <td className="px-4 py-2 border border-black">
                  {order.total_price}
                </td>
                <td className="px-4 py-2 border border-black">
                  {order.quantity}
                </td>
                <td className="px-4 py-2 border border-black">
                  {order.address}
                </td>
                <td className="px-4 py-2 border border-black">{order.email}</td>
                <td className="px-4 py-2 border border-black">{order.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="container mx-auto my-8 px-4">
        <h2 className="text-xl font-bold mb-4">Category Summary</h2>
        <table className="min-w-full table-auto border border-black">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-black">Category</th>
              <th className="px-4 py-2 border border-black">Total Quantity</th>
              <th className="px-4 py-2 border border-black">Total Price</th>
              <th className="px-4 py-2 border border-black">Total Order</th>
            </tr>
          </thead>
          <tbody>
            {categorySummary.map((summary, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border border-black">
                  {summary.Category}
                </td>
                <td className="px-4 py-2 border border-black">
                  {summary["Total quantity"]}
                </td>
                <td className="px-4 py-2 border border-black">
                  {summary["Total price"]}
                </td>
                <td className="px-4 py-2 border border-black">
                  {summary["Total order"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="container mx-auto my-8 px-4">
        <h2 className="text-xl font-bold mb-4">User Order Summary</h2>
        <table className="min-w-full table-auto border border-black">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-black">Username</th>
              <th className="px-4 py-2 border border-black">Total Quantity</th>
              <th className="px-4 py-2 border border-black">Total Price</th>
              <th className="px-4 py-2 border border-black">Total Order</th>
            </tr>
          </thead>
          <tbody>
            {UserOrderSummary.map((userSummary, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border border-black">
                  {userSummary.Username}
                </td>
                <td className="px-4 py-2 border border-black">
                  {userSummary["Total quantity"]}
                </td>
                <td className="px-4 py-2 border border-black">
                  {userSummary["Total price"]}
                </td>
                <td className="px-4 py-2 border border-black">
                  {userSummary["Total order"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="container mx-auto my-8 px-4">
        <h2 className="text-xl font-bold mb-4">Product Summary</h2>
        <table className="min-w-full table-auto border border-black">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-black">Productname</th>
              <th className="px-4 py-2 border border-black">Total Quantity</th>
              <th className="px-4 py-2 border border-black">Total Price</th>
              <th className="px-4 py-2 border border-black">Total Order</th>
            </tr>
          </thead>
          <tbody>
            {productSummary.map((pSummary, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border border-black">
                  {pSummary.Productname}
                </td>
                <td className="px-4 py-2 border border-black">
                  {pSummary["Total quantity"]}
                </td>
                <td className="px-4 py-2 border border-black">
                  {pSummary["Total price"]}
                </td>
                <td className="px-4 py-2 border border-black">
                  {pSummary["Total order"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br />
      <br />
      <br />
    </>
  );
};

export default Promotion;
