"use client";

import Image from "next/image";
import Link from "next/link";
import { cart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { liteProducts } from "@/lib/lite";
import { hearts, useHearts } from "@/lib/wishlist";
import { Bee } from "./brand";
import { BagIcon, HeartIcon } from "./icons";

export function HeartsView() {
  const slugs = useHearts();
  const list = slugs.flatMap((s) => liteProducts.filter((p) => p.s === s));
  if (!list.length)
    return (
      <div className="panel mx-auto mt-10 max-w-lg p-10 text-center">
        <Bee size={52} className="bob mx-auto" />
        <p className="display mt-5 text-[24px]">Одоохондоо хоосон байна</p>
        <p className="mt-2 text-ink-2">Таалагдсан бараан дээрх зүрхийг дараад энд хадгалаарай.</p>
        <Link href="/shop" className="btn btn-ink mt-6">
          Бараа үзэх
        </Link>
      </div>
    );
  return (
    <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
      {list.map((p) => (
        <article key={p.s} className="relative">
          <Link href={`/p/${p.s}`} className="relative block aspect-[4/5] overflow-hidden rounded-[26px] bg-cloud">
            {p.t && <Image src={p.t} alt={p.n} fill sizes="(min-width: 1024px) 280px, 50vw" className={`object-cover ${p.a ? "" : "opacity-70 saturate-50"}`} />}
          </Link>
          <button type="button" onClick={() => hearts.toggle(p.s)} aria-label={`${p.n}: хадгалснаас хасах`} className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white text-rose shadow-sm">
            <HeartIcon size={19} filled />
          </button>
          <Link href={`/p/${p.s}`} className="mt-3 line-clamp-2 px-1 text-[15px] leading-snug font-medium">
            {p.n}
          </Link>
          <div className="mt-1 flex items-center justify-between px-1">
            <b className="display text-[17px] tabular-nums">{formatPrice(p.p)}</b>
            {!p.a ? (
              <span className="text-[13px] text-ink-3">Дууссан</span>
            ) : p.v ? (
              <button type="button" onClick={() => cart.add(p.v!)} className="grid h-9 w-9 place-items-center rounded-full bg-ink text-milk" aria-label={`${p.n}: сагсанд нэмэх`}>
                <BagIcon size={16} />
              </button>
            ) : (
              <Link href={`/p/${p.s}`} className="text-[13px] font-semibold text-sage-d underline underline-offset-4">
                Размер сонгох
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
