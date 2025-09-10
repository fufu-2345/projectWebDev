"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { myAppHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface ProductType {
  id?: number;
  title: string;
  description?: string;
  cost?: number;
  file?: string;
  banner_image?: File | null;
}

const Dashboard: React.FC = () => {
  const { isLoading, authToken } = myAppHook();
  const router = useRouter();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProductType>({
    title: "",
    description: "",
    cost: 0,
    file: "",
    banner_image: null,
  });

  useEffect(() => {
    if (!authToken) {
      router.push("/auth");
      return;
    }
    fetchAllProducts();
  }, [authToken]);

  const handleOnChangeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // upload file
      setFormData({
        ...formData,
        banner_image: event.target.files[0],
        file: URL.createObjectURL(event.target.files[0]),
      });
    } else {
      // no file
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (isEdit) {
        // edit product
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${formData.id}`,
          {
            ...formData,
            _method: "PUT",
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Product Created successfully");
        fetchAllProducts();
      } else {
        // add product
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
        if (response.data.status) {
          toast.success("Product Created successfully");
          //toast.success(response.data.message);
          setFormData({
            title: "",
            description: "",
            cost: 0,
            file: "",
            banner_image: null,
          });
          if (fileRef.current) {
            fileRef.current.value = "";
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setProducts(response.data.products);
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
            <h4 className="text-xl font-semibold mb-4">
              {isEdit ? "Edit" : "Add"} Product
            </h4>
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
                {formData.file && (
                  <Image
                    src={formData.file}
                    alt="Preview"
                    id="bannerPreview"
                    width={100}
                    height={100}
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
                {isEdit ? "Update" : "Add"} Product
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
                {products.map((singleProduct, index) => (
                  <tr key={singleProduct.id}>
                    <td className="px-4 py-2 border-b">{singleProduct.id}</td>
                    <td className="px-4 py-2 border-b">
                      {singleProduct.title}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {singleProduct.banner_image ? (
                        <Image
                          src={singleProduct.banner_image}
                          alt="Product"
                          width={50}
                          height={50}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="px-4 py-2 border-b">
                      ${singleProduct.cost}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 mr-2"
                        onClick={() => {
                          setFormData({
                            id: singleProduct.id,
                            title: singleProduct.title,
                            cost: singleProduct.cost,
                            description: singleProduct.description,
                            file: singleProduct.banner_image,
                          });
                          setIsEdit(true);
                        }}
                      >
                        Edit
                      </button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
