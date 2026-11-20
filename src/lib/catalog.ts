import "server-only";

import data from "@/data/catalog.json";

export type Variant = {
  /** "<zochilProductId>" or "<zochilProductId>-<zochilVariantId>". erxes product code MB-<id>. */
  id: string;
  /** option values joined («M», «XS · Саарал · L»), null for products without options */
  label: string | null;
  opts: Record<string, string>;
  price: number;
  compareAt: number | null;
  /** Zochil stock (counted per product only); null = not counted (orderable), 0 = sold out. */
  stock: number | null;
};
export type Photo = { src: string; w: number; h: number; thumb: { src: string; w: number; h: number } };
export type Option = { title: string; values: string[] };
/** The shop's own «Размер сонголт» note: the model's height and weight, and the size she wore in the photos. */
export type Fit = { height: number; before: number | null; weight: number | null; size: string; advice: string | null };
export type Age = { label: string; from: number; to: number };
export type Product = {
  id: number;
  slug: string;
  title: string;
  /** mama | nursing | baby | sets */
  group: string;
  sub: string | null;
  /** Zochil «Last sizes»: the last sizes of a model */
  last: boolean;
  /** the greeting card: offered next to the cart */
  addon: boolean;
  lines: string[];
  specs: { k: string; v: string }[];
  fit: Fit | null;
  /** baby ages a hat comes in, in months */
  ages: Age[];
  options: Option[];
  variants: Variant[];
  /** place on the shop's own bestseller list, -1 when not on it */
  best: number;
  createdAt: string;
  images: Photo[];
};
export type Group = { id: string; name: string; line: string; count: number; subs: string[] };
export type Post = { id: number; slug: string; title: string; date: string; image: Photo | null; body: string[] };

export const products = data.products as Product[];
export const groups = data.groups as Group[];
export const banners = data.banners as { src: string; w: number; h: number; title: string }[];
export const posts = data.posts as Post[];
export const catalogInfo = { source: data.source, shopId: data.shopId, updatedAt: data.updatedAt };

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byVariant = new Map(products.flatMap((p) => p.variants.map((v) => [v.id, { product: p, variant: v }] as const)));
export const getProduct = (slug: string) => bySlug.get(slug);
export const getVariant = (id: string) => byVariant.get(id);
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const groupName = (id: string) => groups.find((g) => g.id === id)?.name ?? "";
export const sku = (id: string) => `MB-${id}`;

export const soldOut = (v: Pick<Variant, "stock">) => v.stock === 0;
export const available = (p: Product) => p.variants.some((v) => !soldOut(v));
export const fromPrice = (p: Product) => p.variants[0].price;
export const onSale = (p: Product) => p.variants.some((v) => v.compareAt);
export const singleVariant = (p: Product) => (p.variants.length === 1 && !soldOut(p.variants[0]) ? p.variants[0].id : null);
export const cover = (p: Product) => p.images[0]?.thumb ?? null;
export const second = (p: Product) => p.images[1]?.thumb ?? null;
/** Sizes on the card (XS…XL or baby ages), from the first option. */
export const sizeChips = (p: Product) => (p.options.length === 1 && p.options[0].values.length > 1 ? p.options[0].values : []);

/** In stock first, then the shop's bestseller order, then newest. */
const rank = (p: Product) => (p.best < 0 ? 999 : p.best);
export const byPopularity = (a: Product, b: Product) => Number(available(b)) - Number(available(a)) || rank(a) - rank(b) || b.createdAt.localeCompare(a.createdAt) || b.id - a.id;
export const shelf = products.filter((p) => !p.addon);
export const popular = [...shelf].sort(byPopularity);
export const newest = [...shelf].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);
export const card = products.find((p) => p.addon) ?? null;

/** Baby ages for the hat finder: the shop's own size steps. */
export const AGE_STEPS = [
  { id: "0-3", label: "0–3 сар", from: 0, to: 3 },
  { id: "3-6", label: "3–6 сар", from: 3, to: 6 },
  { id: "6-12", label: "6–12 сар", from: 6, to: 12 },
  { id: "12-18", label: "12–18 сар", from: 12, to: 18 },
  { id: "18-24", label: "18–24 сар", from: 18, to: 24 },
  { id: "24-48", label: "2–4 нас", from: 24, to: 48 },
] as const;
/** Hats whose sizes cover that age step (and the matching size labels). */
export function fitsAge(p: Product, step: { from: number; to: number }) {
  return p.ages.filter((a) => a.from < step.to && a.to > step.from);
}

/** Groups the shop gives a «for whom» line on the home page. */
export const WHO = [
  { id: "mama", title: "Жирэмсэн ээжид", line: "Гэдэс томрох тусам ч эвтэйхэн, амьсгалдаг материал", tone: "blush" },
  { id: "nursing", title: "Хөхүүл ээжид", line: "Кноптой энгэр, хөхүүл дэр, тэвэрт", tone: "sage" },
  { id: "baby", title: "Бяцхан үрд", line: "0 сараас 4 нас хүртэлх малгай, lovey", tone: "honey" },
  { id: "sets", title: "Бэлэг өгөх гэж байна", line: "Шинэ ээжид зориулсан бэлэн багцууд", tone: "cloud" },
] as const;
