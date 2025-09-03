"use client";

import Link from "next/link";
import Image from "next/image";
//import React, { useState, useEffect } from "react";

export default function Home() {
  async function fetchData() {
    const res = await fetch("http://localhost:8000/api/hello");
    const data = await res.json();
    console.log(data);
  }

  return (
    <div>
      <section className="bg-blue-600 text-white text-center py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold">Welcome to My Next.js App</h1>
          <p className="text-lg mt-4">
            Build amazing things with Next.js & Tailwind CSS
          </p>
          <a
            href="/auth"
            className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg mt-6 inline-block"
          >
            Get Started
          </a>
        </div>
      </section>

      <section className="container mx-auto px-6 text-center my-16">
        <h2 className="text-3xl font-bold">Awesome Features</h2>
        <div className="flex justify-between mt-12">
          <div className="w-1/3">
            <h4 className="text-xl font-semibold mt-3">Fast Performance</h4>
            <p className="mt-2">Optimized for speed and efficiency.</p>
          </div>
          <div className="w-1/3">
            <h4 className="text-xl font-semibold mt-3">User Friendly</h4>
            <p className="mt-2">Intuitive and easy-to-use design.</p>
          </div>
          <div className="w-1/3">
            <h4 className="text-xl font-semibold mt-3">SEO Ready</h4>
            <p className="mt-2">Boost your search rankings with SEO.</p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white text-center py-4">
        <p className="mb-0">© 2025 MyBrand. All rights reserved.</p>
      </footer>

      <button
        onClick={() => fetchData()}
        className="bg-green-500 text-white px-6 py-2 rounded-full mt-8 mx-auto block"
      >
        hello
      </button>
    </div>
  );
}
