// apps/Frontend/app/product/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

type ProductView = {
  id: number;
  name: string;
  image?: string | null;     // URL เต็มพร้อมใช้งานใน <img src>
  price: number;
  amount: number;
  category: string;
};

const API = process.env.NEXT_PUBLIC_API_URL; // e.g. http://127.0.0.1:8000/api
const DETAIL_BASE = "/product-detail";

// ===== helper: แปลง path -> URL เต็ม =====
const ORIGIN =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, "") || "";

function toAbsoluteUrl(path?: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;          // เป็น URL เต็มแล้ว
  if (path.startsWith("/")) return `${ORIGIN}${path}`;   // /storage/...
  return `${ORIGIN}/${path}`;                            // storage/...
}

export default function ProductPage() {
  const sp = useSearchParams();
  const cate = (sp.get("cate") || "").trim();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [items, setItems] = useState<ProductView[]>([]);
  const token = Cookies.get("authToken"); // ได้จาก AppProvider ตอน login (ถ้ามี)

  useEffect(() => {
    if (!cate) {
      setItems([]);
      setLoading(false);
      return;
    }

    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const url = `${API}/products?category=${encodeURIComponent(cate)}`;

        const headers: Record<string, string> = { Accept: "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(url, { signal: ac.signal, cache: "no-store", headers });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`HTTP ${res.status} ${txt || ""}`.trim());
        }

        const json = await res.json();

        // ใช้ file เป็นหลัก (เหมือนของเพื่อน), fallback -> banner_image -> image
        const list: ProductView[] = (json.products || json.data || []).map((p: any) => ({
          id: p.id,
          name: p.title ?? p.name,
          image: toAbsoluteUrl(p.file ?? p.banner_image ?? p.image ?? null),
          price: Number(p.cost ?? p.price ?? 0),
          amount: Number(p.stock ?? p.amount ?? 0),
          category: p.category,
        }));
        setItems(list);
      } catch (e: any) {
        const msg = String(e?.message || "");
        if (e?.name === "AbortError" || msg.includes("AbortError")) return;
        setErr(msg || "fetch failed");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [cate, token]);

  if (!cate) {
    return (
      <main className="w-full min-h-screen bg-gray-200 px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">เลือกรายการสินค้า</h1>
        <p className="mb-4 text-gray-700">
          กรุณาเลือกประเภทที่{" "}
          <Link href="/cate" className="text-blue-700 underline">
            /cate
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="w-full bg-gray-200 px-4 py-4 pt-16 sm:h-[calc(100svh-4.5rem)] h-[calc(100svh-2rem)] overflow-hidden">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold">ประเภท: {cate}</h1>
        </div>

        {loading && <div className="text-gray-700">กำลังโหลด...</div>}
        {!loading && err && <div className="text-red-600">เกิดข้อผิดพลาด: {err}</div>}

        {!loading && !err && (
          // ขอบนอก (mobile-first → ขยาย padding/ระยะที่ sm)
          <div className="bg-white rounded-[32px] shadow border-2 border-gray-400 bg-gray-200 p-3 sm:p-4 md:p-5">
            {/* กล่องใน (scroll ภายใน) */}
            <div
              className="
                rounded-[28px] bg-white p-4 sm:p-6 md:p-8
                h-[70vh] overflow-y-auto pe-2 overscroll-contain
                border-[3px] border-gray-200
              "
            >
              {/* กริดสินค้า: 2 → (≥640) 3 → (≥768) 4 คอลัมน์ */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {items.map((p) => (
                  <Link
                    key={p.id}
                    href={`${DETAIL_BASE}?id=${p.id}&cate=${encodeURIComponent(p.category)}`}
                    className="group block rounded-[22px] border border-gray-400 overflow-hidden hover:shadow-sm transition focus:outline-none focus:ring-2 focus:ring-gray-300"
                    aria-label={`ดูรายละเอียด ${p.name}`}
                  >
                    {/* ครึ่งบน: รูป */}
                    <div className="relative bg-white aspect-[1.25] overflow-hidden grid place-items-center">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-gray-400">IMG</span>
                      )}
                    </div>

                    {/* เส้นคั่น */}
                    <div className="h-px bg-gray-400" />

                    {/* ครึ่งล่าง: ข้อมูล */}
                    <div className="p-3 sm:p-4">
                      <div className="text-base sm:text-lg font-semibold leading-snug line-clamp-2 group-hover:underline">
                        {p.name}
                      </div>
                      <div className="text-sm sm:text-base text-gray-700 mt-1">
                        คงเหลือ <span className="font-medium text-gray-900">{p.amount}</span>
                      </div>
                      <div className="text-sm sm:text-base text-gray-700">
                        ราคา <span className="font-medium text-gray-900">{p.price.toFixed(2)}</span> ฿
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ปุ่ม Back */}
        <div className="mt-4 sm:mt-6">
          <Link
            href="/.."
            className="inline-flex items-center rounded-full bg-gray-700 px-5 py-2 text-white hover:bg-gray-800 transition"
          >
            Back
          </Link>
        </div>
      </div>
    </main>
  );
}
