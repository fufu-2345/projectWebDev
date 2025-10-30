"use client";
import React, { useState, useEffect } from "react";
import { myAppHook } from "@/context/AppProvider";

export default function Page() {
  const { authToken, isLoading: authLoading } = myAppHook();
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ name: "", address: "", phone: "", birthday: "" });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 ดึงข้อมูลโปรไฟล์
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("http://localhost:8000/api/profile", {
          headers: { Authorization: `Bearer ${authToken}`, Accept: "application/json" },
        });
        const data = await res.json();
        setUser(data.user);
        setForm({
          name: data.user.name || "",
          address: data.user.address || "",
          phone: data.user.phone || "",
          birthday: data.user.birthday || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authToken]);

  // 🔹 อัปเดตโปรไฟล์
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return alert("Please login first");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("address", form.address);
    formData.append("phone", form.phone);
    formData.append("birthday", form.birthday);
    if (file) formData.append("profilepic", file);

    try {
      const res = await fetch("http://localhost:8000/api/profile", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });
      const result = await res.json();
      if (result.user) {
        setUser(result.user);
        setPreview(null);
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (loading || authLoading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg animate-pulse">
        Loading profile...
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
        <div className="text-6xl mb-3">👤</div>
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Please login first.</h2>
        <a
          href="/login"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go to Login
        </a>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-md rounded-xl p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Profile of {user.name}
        </h1>

        <div className="flex flex-col items-center mb-6">
          <img
            src={preview || user.profilepic}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-sm mb-3"
          />
          {isEditing && (
            <input
              type="file"
              onChange={handleFileChange}
              className="text-sm text-gray-600"
            />
          )}
        </div>

        {!isEditing ? (
          // 🔹 View Mode
          <div className="space-y-3 text-gray-700">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{user.address || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{user.phone || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Birthday</p>
              <p className="font-medium">{user.birthday || "-"}</p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition shadow-sm"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          // 🔹 Edit Mode
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full Name"
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Address"
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone Number"
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <input
              type="date"
              value={form.birthday}
              onChange={(e) => setForm({ ...form, birthday: e.target.value })}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-md w-full hover:bg-blue-700 transition shadow-sm"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-400 text-white py-2 rounded-md w-full hover:bg-gray-500 transition shadow-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
