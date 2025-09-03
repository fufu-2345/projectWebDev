"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const Dashboard: React.FC = () => {
  return (
    <>
      <div className="container mx-auto mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Add Product Section */}
          <div className="card p-4 border border-gray-200 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-4">Add Product</h4>
            <form>
              <input
                className="form-input mb-4 p-3 w-full border border-gray-300 rounded-md"
                name="title"
                placeholder="Title"
                required
              />
              <input
                className="form-input mb-4 p-3 w-full border border-gray-300 rounded-md"
                name="description"
                placeholder="Description"
                required
              />
              <input
                className="form-input mb-4 p-3 w-full border border-gray-300 rounded-md"
                name="cost"
                placeholder="Cost"
                type="number"
                required
              />
              <div className="mb-4">
                {/* Image preview section */}
                {/* <Image
                  src="#"
                  alt="Preview"
                  id="bannerPreview"
                  width={100}
                  height={100}
                  style={{ display: "none" }}
                /> */}
              </div>
              <input
                className="form-input mb-4 p-3 w-full border border-gray-300 rounded-md"
                type="file"
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
