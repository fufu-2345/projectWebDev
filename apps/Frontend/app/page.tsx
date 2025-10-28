"use client";

import Link from "next/link";
import { myAppHook, Role } from "@/context/AppProvider"; // <- ใช้ role จาก context

type Category = { id: string; name: string };

const categories: Category[] = [
  { id: "pen",   name: "ปากกา" },
  { id: "pencil", name: "ดินสอ" },
  { id: "eraser", name: "ยางลบ" },
  { id: "ruler",  name: "ไม้บรรทัด" },
  { id: "marker", name: "ปากกาเมจิก" },
  { id: "liquid", name: "ลิควิด" },
];

const FILES: Record<string, string | null> = {
  pen:   "pen.jpg",
  pencil: "pensil.jpg",
  eraser: "staedtler.jpg",
  ruler:  "ruler.jpg",
  marker: "magicpen.jpg",
  liquid: "liquid.jpg",
};

const ORIGIN =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, "") || "";

function imgUrl(cateId: string) {
  const f = FILES[cateId];
  return f ? `${ORIGIN}/storage/product/${f}` : null;
}

export default function CatePage() {
  const { role, isLoading } = myAppHook();
  const isAdmin = role === Role.Admin;

  return (
    <>
      {/* PROMOTION — ซ่อนเมื่อเป็น admin; ระหว่างโหลด role ให้ยังไม่แสดง (กันกระพริบ) */}
      {!isLoading && !isAdmin && (
        <section className="w-full">
          {/* มือถือ: 1 คอลัมน์ | ≥640px: 3 คอลัมน์ */}
          <div className="grid grid-cols-1 sm:grid-cols-3">
            <div className="order-1 sm:order-none bg-gray-200 py-8 sm:py-12 text-center text-2xl sm:text-3xl font-semibold uppercase">
              PROMOTION
            </div>
            <div className="order-2 sm:order-none bg-gray-300 py-8 sm:py-12 text-center text-2xl sm:text-3xl font-semibold uppercase">
              PROMOTION
            </div>
            <div className="order-3 sm:order-none bg-gray-200 py-8 sm:py-12 text-center text-2xl sm:text-3xl font-semibold uppercase">
              PROMOTION
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      <main className="mx-auto px-4 py-4">
        <h1 className="text-2xl font-semibold mb-8">เลือกประเภทสินค้า</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
          {categories.map((c) => {
            const url = imgUrl(c.id);
            return (
              <Link
                key={c.id}
                href={`/product?cate=${c.id}`}
                className="bg-white inline-flex flex-col items-center rounded-xl border p-4 sm:p-6 hover:shadow transition w-full max-w-[280px] sm:max-w-[300px] min-h-[240px] focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                aria-label={`ดูสินค้า ${c.name}`}
                title={c.name}
              >
                <div className="mb-3 grid place-items-center rounded-2xl bg-gray-100 overflow-hidden w-28 h-28 sm:w-36 sm:h-36">
                  {url ? (
                    <img
                      src={url}
                      alt={c.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">IMG</span>
                  )}
                </div>

                <div className="text-lg sm:text-2xl text-center leading-snug tracking-wide">
                  {c.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">ดูสินค้า</div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}