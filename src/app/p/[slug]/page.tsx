import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bee } from "@/components/brand";
import { Gallery } from "@/components/gallery";
import { ChatIcon, ClockIcon, QrIcon, RulerIcon, TruckIcon } from "@/components/icons";
import { ProductBuy } from "@/components/product-buy";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { business } from "@/content/business";
import { available, byPopularity, card, groupName, products, shelf, sku, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site-url";

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

const find = (slug: string) => products.find((p) => p.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = find((await params).slug);
  if (!p) return {};
  const description = [p.lines[0], p.specs[0] && `${p.specs[0].k}: ${p.specs[0].v}`].filter(Boolean).join(" · ").slice(0, 160) || `${p.title}: ${groupName(p.group)}`;
  return { title: p.title, description, alternates: { canonical: `/p/${p.slug}` }, openGraph: { title: p.title, description, images: p.images[0] ? [{ url: p.images[0].src }] : undefined } };
}

/** The shop's text: a line ending in «:» is a small heading for the lines after it. */
function Story({ lines }: { lines: string[] }) {
  const blocks: { h: string | null; items: string[] }[] = [{ h: null, items: [] }];
  for (const l of lines) {
    const m = l.match(/^(.{3,60}?):\s*(.*)$/);
    if (m && /онцлог|юу вэ/i.test(m[1])) {
      blocks.push({ h: m[1], items: m[2] ? [m[2]] : [] });
      continue;
    }
    if (/:$/.test(l) && l.length < 60) blocks.push({ h: l.replace(/:$/, ""), items: [] });
    else blocks.at(-1)!.items.push(l);
  }
  return (
    <div className="space-y-5">
      {blocks
        .filter((b) => b.h || b.items.length)
        .map((b, i) => (
          <div key={i}>
            {b.h && <h3 className="soft text-[19px] text-sage-d">{b.h}</h3>}
            {b.items.length > 0 &&
              (b.items.every((x) => x.length < 90) && b.items.length > 1 ? (
                <ul className="mt-2 space-y-1.5">
                  {b.items.map((x) => (
                    <li key={x} className="flex gap-2.5 text-ink-2">
                      <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                      {x}
                    </li>
                  ))}
                </ul>
              ) : (
                b.items.map((x) => (
                  <p key={x} className="mt-2 text-ink-2">
                    {x}
                  </p>
                ))
              ))}
          </div>
        ))}
    </div>
  );
}

function related(p: Product) {
  const same = shelf.filter((x) => x.id !== p.id && x.sub === p.sub && x.group === p.group);
  const group = shelf.filter((x) => x.id !== p.id && x.group === p.group && !same.includes(x));
  return [...same, ...group].sort((a, b) => Number(available(b)) - Number(available(a)) || byPopularity(a, b)).slice(0, 10);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = find((await params).slug);
  if (!p) notFound();
  const rel = related(p);
  const fit = p.fit;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    sku: sku(String(p.id)),
    image: p.images.slice(0, 3).map((i) => absoluteUrl(i.src)),
    description: p.lines.slice(0, 3).join(" "),
    brand: { "@type": "Brand", name: "MamaBee" },
    offers: {
      "@type": "Offer",
      priceCurrency: "MNT",
      price: p.variants[0].price,
      availability: available(p) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/p/${p.slug}`),
    },
  };

  return (
    <div className="wrap pt-5 pb-28 md:pt-8 md:pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Зам" className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-ink-3">
        <Link href="/shop" className="hover:text-ink">
          Дэлгүүр
        </Link>
        <span>/</span>
        <Link href={`/shop?g=${p.group}`} className="hover:text-ink">
          {groupName(p.group)}
        </Link>
        {p.sub && (
          <>
            <span>/</span>
            <Link href={`/shop?g=${p.group}&s=${encodeURIComponent(p.sub)}`} className="hover:text-ink">
              {p.sub}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="lg:sticky lg:top-[132px] lg:self-start">
          <Gallery photos={p.images} title={p.title} />
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5">
            {!available(p) && <span className="tag bg-cloud text-ink-2">Дууссан</span>}
            {p.last && <span className="tag bg-blush-l text-rose">Сүүлийн размер</span>}
            {p.best >= 0 && p.best < 8 && <span className="tag bg-sage-l text-sage-d">Их захиалгатай</span>}
            {p.specs.map((s) => (
              <span key={s.k} className="tag bg-honey-l text-ink">
                {s.v}
              </span>
            ))}
          </div>
          <h1 className="mt-3 text-[32px] md:text-[44px]">{p.title}</h1>

          <ProductBuy slug={p.slug} title={p.title} options={p.options} variants={p.variants} sizeHint={p.group === "mama" || p.group === "sets" ? (fit?.size ?? null) : undefined} />

          {fit && (
            <div className="mt-7 flex gap-4 rounded-[24px] bg-blush-l p-5">
              <span className="display grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-[20px] font-semibold text-rose shadow-sm">{fit.size}</span>
              <div className="text-[14.5px]">
                <b className="block text-[15.5px] font-semibold">Зурган дээрх модел {fit.size} размер өмссөн</b>
                <span className="mt-0.5 block text-ink-2">
                  Өндөр {fit.height} см{fit.before ? `, жирэмслэхээс өмнө ${fit.before} кг` : ""}
                  {fit.weight ? `, ${fit.before ? "одоо " : ""}${fit.weight} кг` : ""}.
                </span>
                {fit.advice && <span className="mt-1 block font-medium text-rose">{fit.advice}</span>}
                <Link href="/size" className="mt-2 inline-flex items-center gap-1.5 font-semibold text-sage-d underline underline-offset-4">
                  <RulerIcon size={15} /> Өөрийн өндөр, жингээр харьцуулах
                </Link>
              </div>
            </div>
          )}

          {p.ages.length > 0 && (
            <p className="mt-6 rounded-[20px] bg-sage-l px-5 py-4 text-[14.5px] text-ink-2">
              <b className="text-ink">Байгаа размер:</b> {p.ages.map((a) => a.label).join(", ")}. Хүүхдийнхээ насаар бусад малгайг{" "}
              <Link href="/shop?g=baby&s=%D0%9C%D0%B0%D0%BB%D0%B3%D0%B0%D0%B9" className="font-semibold text-sage-d underline underline-offset-4">
                шүүж үзээрэй
              </Link>
              .
            </p>
          )}

          {p.lines.length > 0 && (
            <section className="mt-8 border-t border-line pt-7" aria-label="Тайлбар">
              <Story lines={p.lines} />
            </section>
          )}

          {p.group === "sets" && card && !p.addon && (
            <p className="mt-7 flex gap-3 rounded-[20px] bg-honey-l p-4 text-[14.5px] text-ink-2">
              <Bee size={22} className="shrink-0" />
              <span>
                Бэлэг болгох уу? <b className="text-ink">Мэндчилгээний карт {formatPrice(card.variants[0].price)}</b>-ийг{" "}
                <Link href={`/p/${card.slug}`} className="font-semibold text-sage-d underline underline-offset-4">
                  нэмж болно
                </Link>
                . {business.rules.card}
              </span>
            </p>
          )}

          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {[
              { Icon: TruckIcon, t: `${business.zone.name}: ${formatPrice(business.zone.price)}`, d: `${formatPrice(business.zone.freeOver)}-өөс дээш үнэгүй` },
              { Icon: ClockIcon, t: "24–48 цагт хүргэнэ", d: business.rules.delivery },
              { Icon: QrIcon, t: "QPay", d: "Захиалснаас хойш 10 минутад төлнө" },
              { Icon: ChatIcon, t: "Размер солих: 48 цаг", d: "Хүргэлтээр, 6,000₮ нэмэгдэнэ. Буцаалтгүй." },
            ].map(({ Icon, t, d }) => (
              <li key={t} className="flex gap-3 rounded-[20px] bg-cloud p-4">
                <Icon size={20} className="mt-0.5 shrink-0 text-sage-d" />
                <span className="text-[13.5px] text-ink-2">
                  <b className="block text-[14.5px] font-semibold text-ink">{t}</b>
                  {d}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-ink-3">Код: {sku(String(p.id))}</p>
        </div>
      </div>

      {rel.length > 0 && (
        <section className="mt-20" aria-labelledby="rel">
          <h2 id="rel" className="text-[28px] md:text-[36px]">
            Үүнтэй <span className="soft text-sage-d">хамт</span> үзээрэй
          </h2>
          <Scroller label="Төстэй бараа" className="snap-row no-scrollbar -mx-4 mt-6 px-4 pb-2 md:mx-0 md:px-0">
            {rel.map((x, i) => (
              <div key={x.id} className="w-[46vw] max-w-[260px] sm:w-[230px]">
                <ProductCard p={x} i={i} />
              </div>
            ))}
          </Scroller>
        </section>
      )}
    </div>
  );
}
