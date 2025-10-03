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
  const [promotion, setPromotion] = useState<formData[]>([]);
  const [formData, setFormData] = useState<formData[]>([
    { id: 1, discount: 0 },
    { id: 2, discount: 0 },
    { id: 3, discount: 0 },
  ]);

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
      setPromotion(response.data.promotion);
      setFormData(response.data.promotion);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleOnChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = [...formData];
    newFormData[parseInt(event.target.name)].discount = parseInt(
      event.target.value
    );
    setFormData(newFormData);
  };

  const valueChecker = (index: number): number => {
    return formData[index]?.discount ?? 0;
  };

  return (
    <>
      <div className="bg-yellow-200 sm:bg-blue-500">
        <p>Edit Promotion</p>
        <form onSubmit={handleFormSubmit}>
          <label>
            Promotion 1:{" "}
            <input
              type="number"
              pattern="^/d+$"
              className="text-right"
              name="0"
              value={valueChecker(0)}
              onChange={handleOnChangeEvent}
            ></input>
            %
          </label>
          <br />
          <label>
            Promotion 2:{" "}
            <input
              type="number"
              pattern="^/d+$"
              className="text-right"
              name="1"
              value={valueChecker(1)}
              onChange={handleOnChangeEvent}
            ></input>
            %
          </label>
          <br />
          <label>
            Promotion 3:{" "}
            <input
              type="number"
              pattern="^/d+$"
              className="text-right"
              name="2"
              value={valueChecker(2)}
              onChange={handleOnChangeEvent}
            ></input>
            %
          </label>
          <br />

          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
};

export default Promotion;
