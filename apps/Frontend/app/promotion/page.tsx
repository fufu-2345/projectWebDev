"use client";

import React, { useState, useEffect } from "react";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import axios from "axios";
import toast from "react-hot-toast";

interface formData {
  id: number[];
  discount: number[];
}

const Promotion: React.FC = () => {
  const { isLoading, authToken } = myAppHook();
  const router = useRouter();
  const [discount, setDiscount] = useState([0, 0, 0]);
  const [formData, setFormData] = useState<formData>({ id: [], discount: [] });

  if (isLoading) {
    return <Loader />;
  }

  useEffect(() => {
    if (!authToken) {
      router.push("/auth");
      return;
    }
  }, [authToken]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <div className="">
        <p>Edit Promotion</p>
        <form onSubmit={handleFormSubmit}>
          <label>
            Promotion 1:{" "}
            <input type="number" pattern="^/d+$" className="text-right"></input>
            %
          </label>
          <br />
          <label>
            Promotion 2:{" "}
            <input type="number" pattern="^/d+$" className="text-right"></input>
            %
          </label>
          <br />
          <label>
            Promotion 3:{" "}
            <input type="number" pattern="^/d+$" className="text-right"></input>
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
