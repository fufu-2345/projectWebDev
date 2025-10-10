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
  const [isEditing, setIsEditing] = useState(false); // ✅ ควบคุม edit mode

  // ดึงข้อมูลโปรไฟล์
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
        setIsEditing(false); // ✅ กลับไป view mode หลังบันทึก
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

  if (loading || authLoading) return <p className="p-6 text-center">Loading profile...</p>;
  if (!user) return <p className="p-6 text-center">Please login first.</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Profile of {user.name}</h1>

      <div className="flex flex-col items-center mb-4">
        <img
          src={preview || user.profilepic}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border mb-2"
        />
        {isEditing && <input type="file" onChange={handleFileChange} />}
      </div>

      {!isEditing ? (
        // 🔹 View Mode
        <div className="space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Address:</strong> {user.address || "-"}</p>
          <p><strong>Phone:</strong> {user.phone || "-"}</p>
          <p><strong>Birthday:</strong> {user.birthday || "-"}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
      ) : (
        // 🔹 Edit Mode
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Address"
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone"
            className="border p-2 w-full rounded"
          />
          <input
            type="date"
            value={form.birthday}
            onChange={(e) => setForm({ ...form, birthday: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded w-full hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
