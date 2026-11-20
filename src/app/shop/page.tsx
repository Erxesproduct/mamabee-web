import type { Metadata } from "next";
import Link from "next/link";
import { Bee } from "@/components/brand";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { AGE_STEPS, available, byPopularity, fitsAge, groups, onSale, shelf, soldOut, type Product } from "@/lib/catalog";

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const SIZES = ["XS", "S", "M", "L", "XL"];
const SORTS = [
  { id: "", name: "Эрэлттэй" },
  { id: "new", name: "Шинэ" },
  { id: "low", name: "Үнэ ↑" },
  { id: "high", name: "Үнэ ↓" },
];

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const g = groups.find((x) => x.id === one(sp.g));
  return { title: g ? g.name : "Бүх бараа", description: g ? g.line : "MamaBee: ээж, хүүхдийн бүх бараа", alternates: { canonical: g ? `/shop?g=${g.id}` : "/shop" } };
}

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").trim();
const hasSize = (p: Product, size: string) => p.variants.some((v) => !soldOut(v) && Object.values(v.opts).includes(size));

export default async function Shop({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const f = { g: one(sp.g), s: one(sp.s), age: one(sp.age), size: one(sp.size), last: one(sp.last), sale: one(sp.sale), stock: one(sp.stock), q: one(sp.q).slice(0, 60), sort: one(sp.sort) };
  const group = groups.find((x) => x.id === f.g);
  const age = AGE_STEPS.find((a) => a.id === f.age);

  let list = shelf.filter((p) => {
    if (group && p.group !== group.id) return false;
    if (f.s && p.sub !== f.s) return false;
    if (age && !fitsAge(p, age).length) return false;
    if (f.size && !hasSize(p, f.size)) return false;
    if (f.last && !p.last) return false;
    if (f.sale && !onSale(p)) return false;
    if (f.stock && !available(p)) return false;
    if (f.q) {
      const hay = norm(`${p.title} ${p.sub ?? ""} ${p.lines.join(" ")} ${p.options.flatMap((o) => o.values).join(" ")}`);
      if (!norm(f.q).split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  list =
    f.sort === "new"
      ? [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id)
      : f.sort === "low"
        ? [...list].sort((a, b) => a.variants[0].price - b.variants[0].price)
        : f.sort === "high"
          ? [...list].sort((a, b) => b.variants[0].price - a.variants[0].price)
          : [...list].sort(byPopularity);

  const href = (patch: Partial<typeof f>) => {
    const next = { ...f, ...patch };
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) q.set(k, v);
    const s = q.toString();
    return s ? `/shop?${s}` : "/shop";
  };
  const showSizes = !group || group.id === "mama" || group.id === "sets";
  const showAges = !group || group.id === "baby";
  const active = [f.s, f.age, f.size, f.last, f.sale, f.stock, f.q].some(Boolean);
  const highlight = [f.size, ...(age ? shelf.flatMap((p) => fitsAge(p, age).map((a) => a.label)) : [])].filter(Boolean);

  return (
    <div className="wrap pt-8 pb-16 md:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">
            <Bee size={18} /> {list.length} бараа
          </p>
          <h1 className="mt-2 text-[36px] md:text-[52px]">
            {group ? group.name : f.last ? "Сүүлийн размерууд" : "Бүх бараа"}
            {age && <span className="soft text-sage-d"> · {age.label}</span>}
          </h1>
          {group && <p className="mt-1 text-ink-2">{group.line}</p>}
        </div>
        <form action="/shop" id="search" className="relative w-full sm:w-[320px]" role="search">
          {Object.entries(f).map(([k, v]) => (k !== "q" && v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
          <SearchIcon size={19} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3" />
          <input name="q" defaultValue={f.q} placeholder="Халад, lovey, 0–3 сар…" aria-label="Бараа хайх" className="field mt-0 rounded-full bg-white pl-11 ring-1 ring-line" />
        </form>
      </div>

      <div className="sticky top-[105px] z-30 -mx-4 mt-6 border-b border-line/60 bg-milk/92 px-4 py-3 backdrop-blur md:top-[115px] md:mx-0 md:rounded-[24px] md:border md:px-4">
        <Scroller small label="Ангилал" as="nav" className="no-scrollbar flex gap-2 overflow-x-auto">
          <Link href={href({ g: "", s: "", age: "", size: "" })} className="chip" aria-current={!group ? "page" : undefined}>
            Бүгд
          </Link>
          {groups.map((g) => (
            <Link key={g.id} href={href({ g: g.id, s: "", age: g.id === "baby" ? f.age : "", size: g.id === "baby" || g.id === "nursing" ? "" : f.size })} className="chip" aria-current={group?.id === g.id ? "page" : undefined}>
              {g.name} <span className="text-[12px] opacity-60">{g.count}</span>
            </Link>
          ))}
          <span className="mx-1 w-px shrink-0 bg-line" aria-hidden />
          <Link href={href({ sale: f.sale ? "" : "1" })} className="chip" data-on={!!f.sale}>
            Хямдралтай
          </Link>
          <Link href={href({ last: f.last ? "" : "1" })} className="chip" data-on={!!f.last}>
            Сүүлийн размер
          </Link>
          <Link href={href({ stock: f.stock ? "" : "1" })} className="chip" data-on={!!f.stock}>
            Бэлэн байгаа
          </Link>
        </Scroller>

        {(group?.subs.length || showSizes || showAges) && (
          <div className="mt-2.5 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
            {group && group.subs.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {group.subs.map((s) => (
                  <Link key={s} href={href({ s: f.s === s ? "" : s })} className="chip min-h-9 px-3 text-[13.5px]" data-on={f.s === s}>
                    {s}
                  </Link>
                ))}
              </div>
            )}
            {showSizes && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[13px] text-ink-3">Размер</span>
                {SIZES.map((s) => (
                  <Link key={s} href={href({ size: f.size === s ? "" : s })} className="chip min-h-9 min-w-9 justify-center px-2.5 text-[13.5px]" data-on={f.size === s}>
                    {s}
                  </Link>
                ))}
              </div>
            )}
            {showAges && (
              <Scroller small label="Хүүхдийн нас" className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
                <span className="shrink-0 text-[13px] text-ink-3">Нас</span>
                {AGE_STEPS.map((a) => (
                  <Link key={a.id} href={href({ age: f.age === a.id ? "" : a.id })} className="chip min-h-9 px-3 text-[13.5px]" data-on={f.age === a.id}>
                    {a.label}
                  </Link>
                ))}
              </Scroller>
            )}
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {f.q && (
            <Link href={href({ q: "" })} className="tag bg-cloud py-1.5 text-[13.5px] text-ink">
              «{f.q}» <CloseIcon size={13} />
            </Link>
          )}
          {active && (
            <Link href={href({ s: "", age: "", size: "", last: "", sale: "", stock: "", q: "" })} className="text-[14px] font-semibold text-rose hover:underline">
              Шүүлтүүр арилгах
            </Link>
          )}
        </div>
        <div className="flex flex-wrap gap-1 rounded-full bg-cloud p-1" role="group" aria-label="Эрэмбэ">
          {SORTS.map((s) => (
            <Link key={s.id} href={href({ sort: s.id })} aria-current={f.sort === s.id ? "true" : undefined} className={`rounded-full px-3 py-1.5 text-[13.5px] font-medium ${f.sort === s.id ? "bg-white shadow-sm" : "text-ink-2"}`}>
              {s.name}
            </Link>
          ))}
        </div>
      </div>

      {list.length ? (
        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
          {list.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} highlight={highlight} />
          ))}
        </div>
      ) : (
        <div className="panel mx-auto mt-10 max-w-lg p-10 text-center">
          <Bee size={48} className="bob mx-auto" />
          <p className="display mt-5 text-[24px]">Энэ сонголтоор бараа олдсонгүй</p>
          <p className="mt-2 text-ink-2">Шүүлтүүрээ багасгаад үзээрэй, эсвэл бидэнд чатаар бичээрэй.</p>
          <Link href="/shop" className="btn btn-ink mt-6">
            Бүх бараа
          </Link>
        </div>
      )}
    </div>
  );
}
