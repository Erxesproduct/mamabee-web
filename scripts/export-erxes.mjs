// node scripts/export-erxes.mjs → docs/erxes/mamabee-{categories,products,delivery}.csv
// Files for erxes Products & Services import (Settings → Import). Every row comes from src/data/catalog.json.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const c = JSON.parse(readFileSync(path.join(root, "src/data/catalog.json"), "utf8"));
const out = path.join(root, "docs/erxes");
mkdirSync(out, { recursive: true });

const cell = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (rows) => "﻿" + rows.map((r) => r.map(cell).join(",")).join("\n") + "\n";
const code = (id) => `MB-${id.toUpperCase()}`;

// categories: MB → the shop's groups (mama, nursing, baby, sets) → their sub-categories, plus delivery
const cats = [["code", "name", "parent code"], ["MB", "MamaBee", ""]];
for (const g of c.groups) {
  cats.push([code(g.id), g.name, "MB"]);
  for (const [i, s] of (g.subs ?? []).entries()) cats.push([`${code(g.id)}-${i + 1}`, typeof s === "string" ? s : s.name, code(g.id)]);
}
cats.push(["MB-DELIVERY", "Хүргэлт", "MB"]);
writeFileSync(path.join(out, "mamabee-categories.csv"), csv(cats));

const subCode = (p) => {
  const g = c.groups.find((x) => x.id === p.group);
  const i = (g?.subs ?? []).findIndex((s) => (typeof s === "string" ? s : s.name) === p.sub);
  return i >= 0 ? `${code(p.group)}-${i + 1}` : code(p.group);
};
const rows = [["code", "name", "category code", "type", "unit price", "price before sale", "options", "last sizes", "specs", "stock (Zochil)", "zochil product id", "image (website path)"]];
for (const p of c.products)
  for (const v of p.variants)
    rows.push([
      `MB-${v.id}`,
      [p.title, v.label].filter(Boolean).join(" · ").slice(0, 200),
      subCode(p),
      "product",
      v.price,
      v.compareAt ?? "",
      Object.entries(v.opts ?? {}).map(([k, x]) => `${k}=${x}`).join("; "),
      p.last ? "Last sizes" : "",
      (p.specs ?? []).map((s) => `${s.k}=${s.v}`).join("; "),
      v.stock ?? "",
      p.id,
      p.images[0]?.src ?? "",
    ]);
writeFileSync(path.join(out, "mamabee-products.csv"), csv(rows));

// the shop's one Zochil delivery option («A бүс»), with its free-delivery limit
const z = c.shop.zone;
writeFileSync(
  path.join(out, "mamabee-delivery.csv"),
  csv([
    ["code", "name", "category code", "type", "unit price", "source"],
    ["MB-DELIVERY-A", `Хүргэлт: ${z.title} (${z.description})`, "MB-DELIVERY", "service", z.price, `Zochil delivery option; free when the goods are over ${z.freeOver}₮`],
    ["MB-EXCHANGE", "Размер солих хүргэлт", "MB-DELIVERY", "service", 6000, "Zochil terms: size exchange within 48 h, delivery 6,000₮"],
  ]),
);
console.log(`categories ${cats.length - 1}, products ${rows.length - 1}, delivery 2`);
