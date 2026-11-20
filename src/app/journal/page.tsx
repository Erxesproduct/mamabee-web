import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bee } from "@/components/brand";
import { posts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Зөвлөгөө", description: "Хүүхдийн үүргэвч, түнхний аюулгүй байдал, #mamabeemoments: MamaBee-ийн нийтлэлүүд.", alternates: { canonical: "/journal" } };

export default function Journal() {
  return (
    <div className="wrap pt-10 pb-28 md:pt-14 md:pb-16">
      <p className="kicker">
        <Bee size={18} /> Зөвлөгөө
      </p>
      <h1 className="mt-3 text-[38px] md:text-[54px]">
        Ээжүүдэд <span className="soft text-sage-d">хэрэгтэй</span> мэдээлэл
      </h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {posts.map((p) => (
          <Link key={p.id} href={`/journal/${p.slug}`} className="group grid overflow-hidden rounded-[28px] bg-white ring-1 ring-line transition hover:-translate-y-1 sm:grid-cols-[200px_1fr]">
            {p.image && (
              <span className="relative block aspect-[4/3] bg-cloud sm:aspect-auto">
                <Image src={p.image.thumb.src} alt="" fill sizes="(min-width: 640px) 200px, 100vw" className="object-cover" />
              </span>
            )}
            <span className="block p-6">
              <b className="display block text-[21px] leading-snug font-medium group-hover:text-sage-d">{p.title}</b>
              <span className="mt-2 line-clamp-3 text-[14.5px] text-ink-2">{p.body[0]}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
