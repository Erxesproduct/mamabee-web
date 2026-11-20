"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { business } from "@/content/business";
import { ChatIcon } from "./icons";

export type Model = {
  key: string;
  height: number;
  before: number | null;
  weight: number | null;
  size: string;
  advice: string | null;
  products: { slug: string; title: string; thumb: string; sizes: string[] }[];
};

/**
 * Compares the visitor with the models in the shop's photos (height and weight, as the shop writes them). It only
 * says which model is closest and what she wore: no size rule is invented.
 */
export function SizeFinder({ models }: { models: Model[] }) {
  const [h, setH] = useState("");
  const [w, setW] = useState("");
  const height = Number(h);
  const weight = Number(w);
  const ready = height >= 140 && height <= 195 && weight >= 35 && weight <= 140;
  // height counts in 5 cm steps, weight in 4 kg steps
  const dist = (m: Model) => Math.hypot((m.height - height) / 5, ((m.weight ?? m.before ?? weight) - weight) / 4);
  const ranked = ready ? [...models].sort((a, b) => dist(a) - dist(b)) : models;

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <form className="panel self-start p-6 lg:sticky lg:top-[132px]" onSubmit={(e) => e.preventDefault()}>
        <p className="display text-[22px]">Таны хэмжээ</p>
        <label className="label mt-5">
          Өндөр (см)
          <input value={h} onChange={(e) => setH(e.target.value.replace(/\D/g, "").slice(0, 3))} inputMode="numeric" placeholder="163" className="field" />
        </label>
        <label className="label mt-4">
          Одоогийн жин (кг)
          <input value={w} onChange={(e) => setW(e.target.value.replace(/\D/g, "").slice(0, 3))} inputMode="numeric" placeholder="62" className="field" />
        </label>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {[150, 155, 160, 165, 170].map((x) => (
            <button key={x} type="button" onClick={() => setH(String(x))} className="chip min-h-9 px-3 text-[13px]" data-on={height === x}>
              {x} см
            </button>
          ))}
        </div>
        <p className="mt-5 text-[13.5px] text-ink-2">{ready ? "Хамгийн ойр модел дээд талд гарлаа." : "Өндөр, жингээ оруулахад загварууд таньтай ойр байдлаар эрэмбэлэгдэнэ."}</p>
        <a href={`https://m.me/mamabeemongolia`} target="_blank" rel="noreferrer" className="btn btn-line mt-5 w-full">
          <ChatIcon size={17} /> Размер асуух (чат)
        </a>
        <p className="mt-3 text-center text-[13px] text-ink-3">
          эсвэл{" "}
          <a href={`tel:${business.phone.tel}`} className="font-semibold underline">
            {business.phone.display}
          </a>
        </p>
      </form>

      <ol className="space-y-4">
        {ranked.map((m, i) => {
          const top = ready && i === 0;
          return (
            <li key={m.key} className={`rounded-[28px] p-5 transition md:p-6 ${top ? "pop-in bg-white shadow-[0_24px_50px_-30px_rgb(59_63_69/0.45)] ring-2 ring-sage" : "bg-white ring-1 ring-line"}`}>
              <div className="flex flex-wrap items-center gap-4">
                <span className={`display grid h-16 w-16 shrink-0 place-items-center rounded-full text-[24px] font-semibold ${top ? "bg-sage-d text-white" : "bg-blush-l text-rose"}`}>{m.size}</span>
                <div className="min-w-0 flex-1">
                  {top && <span className="tag mb-1 bg-sage-l text-sage-d">Таньтай хамгийн ойр</span>}
                  <p className="text-[16px] font-semibold">
                    Модел: {m.height} см{m.weight ? `, ${m.weight} кг` : ""}
                    {m.before ? <span className="font-normal text-ink-2"> (жирэмслэхээс өмнө {m.before} кг)</span> : null}
                  </p>
                  <p className="text-[14.5px] text-ink-2">
                    Зурган дээр <b className="text-ink">{m.size}</b> размер өмссөн
                  </p>
                  {m.advice && <p className="mt-1 text-[14px] font-medium text-rose">{m.advice}</p>}
                </div>
              </div>
              <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto">
                {m.products.map((p) => (
                  <Link key={p.slug} href={`/p/${p.slug}`} className="group w-[124px] shrink-0">
                    <span className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-cloud">
                      <Image src={p.thumb} alt="" fill sizes="124px" className="object-cover transition group-hover:scale-105" />
                    </span>
                    <span className="mt-1.5 line-clamp-2 text-[13px] leading-snug">{p.title}</span>
                    {p.sizes.length > 0 && <span className="block text-[11.5px] text-ink-3">{p.sizes.join(" · ")}</span>}
                  </Link>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
