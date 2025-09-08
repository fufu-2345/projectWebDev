"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface ProductType {
  title: string;
  description: string;
  cost: number;
  file: File | null;
  banner_image: string;
}

const Dashboard: React.FC = () => {
  const { isLoading, authToken } = myAppHook();
  const router = useRouter();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [formData, setFormDate] = useState<ProductType>({
    title: "",
    description: "",
    cost: 0,
    file: null,
    banner_image: "",
  });

  useEffect(() => {
    if (!authToken) {
      router.push("/auth");
      return;
    }
  }, [authToken]);

  const handleOnChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormDate({
        ...formData,
        file: event.target.files[0],
        banner_image: URL.createObjectURL(event.target.files[0]),
      });
    } else {
      setFormDate({
        ...formData,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container mx-auto mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Add Product Section */}
          <div className="card p-4 border border-gray-200 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-4">Add Product</h4>
            <form onSubmit={handleFormSubmit}>
              <input
                className="form-input mb-4 p-3 w-full border border-gray-300 rounded-md"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleOnChangeEvent}
                required
              />
              <input
                className="form-input mb-4 p-3 w-full border border-gray-300 rounded-md"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleOnChangeEvent}
                required
              />
              <input
                className="form-input mb-4 p-3 w-full border border-gray-300 rounded-md"
                name="cost"
                placeholder="Cost"
                type="number"
                value={formData.cost}
                onChange={handleOnChangeEvent}
                required
              />
              <div className="mb-2">
                {formData.banner_image && (
                  <Image
                    src={formData.banner_image}
                    alt="Preview"
                    id="bannerPreview"
                    width={100}
                    height={100}
                    style={{ display: "none" }}
                  />
                )}
              </div>
              <input
                className="form-input mb-4 p-3 w-full border border-gray-300 rounded-md"
                type="file"
                ref={fileRef}
                onChange={handleOnChangeEvent}
                id="bannerInput"
              />
              <button
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
                type="submit"
              >
                Add Product
              </button>
            </form>
          </div>

          {/* Product List Section */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left border-b">ID</th>
                  <th className="px-4 py-2 text-left border-b">Title</th>
                  <th className="px-4 py-2 text-left border-b">Banner</th>
                  <th className="px-4 py-2 text-left border-b">Cost</th>
                  <th className="px-4 py-2 text-left border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-b">1</td>
                  <td className="px-4 py-2 border-b">Sample Product</td>
                  <td className="px-4 py-2 border-b">
                    {/* <Image
                      src="#"
                      alt="Product"
                      width={50}
                      height={50}
                    /> */}
                  </td>
                  <td className="px-4 py-2 border-b">$100</td>
                  <td className="px-4 py-2 border-b">
                    <button className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 mr-2">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
