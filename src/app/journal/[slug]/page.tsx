import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bee } from "@/components/brand";
import { ProductCard } from "@/components/product-card";
import { business } from "@/content/business";
import { getPost, popular, posts } from "@/lib/catalog";

export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPost((await params).slug);
  return p ? { title: p.title, description: p.body[0]?.slice(0, 160), alternates: { canonical: `/journal/${p.slug}` } } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  // babywearing posts lead to the carrier; the rest to the bestsellers
  const carrier = /үүргэвч|үүрч|түнх/i.test(p.title);
  const picks = (carrier ? popular.filter((x) => x.sub === "Comfy huggy") : popular).slice(0, 3);
  return (
    <article className="wrap pt-8 pb-28 md:pt-12 md:pb-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/journal" className="text-[14px] font-semibold text-sage-d hover:underline">
          ← Зөвлөгөө
        </Link>
        <h1 className="mt-4 text-[34px] md:text-[48px]">{p.title}</h1>
        <p className="mt-2 flex items-center gap-2 text-[14px] text-ink-3">
          <Bee size={16} /> MamaBee · {p.date.replaceAll("-", ".")}
        </p>
        {p.image && (
          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[30px] bg-cloud">
            <Image src={p.image.src} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
        )}
        <div className="prose-mb mt-8 text-[17px] leading-[1.75] text-ink-2">
          {p.body.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
        {p.slug === "mamabeemoments" && (
          <a href={business.instagram} target="_blank" rel="noreferrer" className="btn btn-honey mt-8">
            #mamabeemoments · {business.instagramHandle}
          </a>
        )}
      </div>
      {picks.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl">
          <h2 className="text-[26px] md:text-[32px]">
            {carrier ? "Хүүхдийн түнх, нуруунд ээлтэй тэвэрт" : "Ээжүүдийн сонголт"}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5">
            {picks.map((x, i) => (
              <ProductCard key={x.id} p={x} i={i} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
