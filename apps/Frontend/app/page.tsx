"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

function Page() {
  async function fetchData() {
    const res = await fetch("http://localhost:8000/api/hello");
    const data = await res.json();
    console.log(data);
  }

  return (
    <div>
      <button onClick={() => fetchData()}>aaaaaaa</button>
    </div>
  );
}

export default Page;
