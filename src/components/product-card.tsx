import Image from "next/image";
import Link from "next/link";
import { available, cover, fromPrice, onSale, second, singleVariant, sizeChips, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { CardActions } from "./card-actions";

const TONES = ["bg-blush-l", "bg-sage-l", "bg-honey-l", "bg-sky"];

export function ProductCard({ p, i = 0, highlight }: { p: Product; i?: number; highlight?: string[] }) {
  const img = cover(p);
  const img2 = second(p);
  const out = !available(p);
  const v = p.variants[0];
  const sizes = sizeChips(p);
  const off = v.compareAt ? Math.round((1 - v.price / v.compareAt) * 100) : 0;
  return (
    <article className="group relative flex flex-col">
      <Link href={`/p/${p.slug}`} className={`relative block aspect-[4/5] overflow-hidden rounded-[26px] ${TONES[i % TONES.length]}`}>
        {img && (
          <Image
            src={img.src}
            alt={p.title}
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
            className={`object-cover transition duration-700 group-hover:scale-[1.04] ${out ? "opacity-70 saturate-50" : ""} ${img2 ? "group-hover:opacity-0" : ""}`}
          />
        )}
        {img2 && <Image src={img2.src} alt="" fill sizes="(min-width: 1024px) 280px, 50vw" className="object-cover opacity-0 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100" />}
        <span className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {out ? (
            <span className="tag bg-white/95 text-ink-2">Дууссан</span>
          ) : (
            <>
              {onSale(p) && <span className="tag bg-rose text-white">−{off}%</span>}
              {p.last && <span className="tag bg-white/95 text-rose">Сүүлийн размер</span>}
              {p.best >= 0 && p.best < 8 && <span className="tag bg-white/95 text-sage-d">Их захиалгатай</span>}
            </>
          )}
        </span>
      </Link>
      <CardActions slug={p.slug} variantId={out ? null : singleVariant(p)} title={p.title} />
      <div className="mt-3 px-1">
        <Link href={`/p/${p.slug}`} className="line-clamp-2 text-[15.5px] leading-snug font-medium hover:text-sage-d">
          {p.title}
        </Link>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="display text-[18px] font-semibold tabular-nums">
            {formatPrice(fromPrice(p))}
          </span>
          {v.compareAt && <s className="text-[13.5px] text-ink-3 tabular-nums">{formatPrice(v.compareAt)}</s>}
        </p>
        {sizes.length > 0 && (
          <p className="mt-1.5 flex flex-wrap gap-1">
            {sizes.slice(0, 6).map((s) => (
              <span key={s} className={`rounded-full px-2 py-0.5 text-[11.5px] font-medium ${highlight?.includes(s) ? "bg-sage-d text-white" : "bg-cloud text-ink-2"}`}>
                {s}
              </span>
            ))}
          </p>
        )}
      </div>
    </article>
  );
}
