"use client";

import React, { useState, useEffect } from "react";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import axios from "axios";
import toast from "react-hot-toast";

interface formData {
  id: number;
  discount: number;
}

const Promotion: React.FC = () => {
  const { isLoading, authToken } = myAppHook();
  const router = useRouter();
  const [formData, setFormData] = useState<formData[]>([]);

  if (isLoading) {
    return <Loader />;
  }

  useEffect(() => {
    if (!authToken) {
      router.push("/auth");
      return;
    }
    fetchData();
  }, [authToken]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/promotions`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setFormData(response.data.promotion);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/updatePromotions`,
        { promotions: formData },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success("Updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update");
    }
  };

  const handleOnChangeEvent = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newFormData = [...formData];
    newFormData[index].discount = parseInt(event.target.value) || 0;
    setFormData(newFormData);
  };

  const valueChecker = (index: number): number => {
    return formData[index]?.discount ?? 0;
  };

  return (
    <div className="bg-yellow-200 sm:bg-blue-500 p-4">
      <p className="font-bold mb-2">Edit Promotion</p>
      <form onSubmit={handleFormSubmit}>
        {formData.map((item, index) => (
          <div key={item.id} className="mb-2">
            <label>
              Promotion {item.id}:{" "}
              <input
                type="number"
                className="text-right border rounded px-2"
                value={item.discount}
                onChange={(e) => handleOnChangeEvent(e, index)}
              />
              %
            </label>
          </div>
        ))}

        <input
          type="submit"
          value="Submit"
          className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer"
        />
      </form>
    </div>
  );
};

export default Promotion;
