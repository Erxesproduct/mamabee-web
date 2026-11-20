import type { Metadata } from "next";
import Link from "next/link";
import { Bee, Cloud } from "@/components/brand";
import { SizeFinder, type Model } from "@/components/size-finder";
import { business } from "@/content/business";
import { AGE_STEPS, fitsAge, shelf } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Размер туслах",
  description: "Зурган дээрх модел ээжүүдийн өндөр, жин, өмссөн размертай өөрийгөө харьцуулж размераа сонгоорой. Хүүхдийн малгайг насаар нь.",
  alternates: { canonical: "/size" },
};

export default function SizePage() {
  // one entry per model (same height, weights and size), with the products she was photographed in
  const models = new Map<string, Model>();
  for (const p of shelf) {
    if (!p.fit || !p.images[0]) continue;
    const key = `${p.fit.height}|${p.fit.before}|${p.fit.weight}|${p.fit.size}`;
    const m = models.get(key) ?? { key, height: p.fit.height, before: p.fit.before, weight: p.fit.weight, size: p.fit.size, advice: p.fit.advice, products: [] };
    m.advice ??= p.fit.advice;
    m.products.push({ slug: p.slug, title: p.title, thumb: p.images[0].thumb.src, sizes: p.options.find((o) => /размер/i.test(o.title))?.values ?? [] });
    models.set(key, m);
  }
  const hats = shelf.filter((p) => p.ages.length);

  return (
    <div className="pb-16">
      <section className="bees relative overflow-hidden bg-blush-l [--bee-color:var(--color-rose)] [--bee-opacity:.06]">
        <Cloud className="drift absolute -top-4 right-4 w-48 md:w-72" color="#fff" />
        <div className="wrap relative py-12 md:py-16">
          <p className="kicker text-rose">
            <Bee size={18} /> Размер туслах
          </p>
          <h1 className="mt-3 max-w-3xl text-[38px] md:text-[56px]">
            Өөртэйгөө <span className="soft text-rose">хамгийн ойр</span> моделийг олоорой
          </h1>
          <p className="mt-4 max-w-2xl text-ink-2">
            MamaBee бүх зурган дээрээ модел ээж ямар өндөр, жинтэй, ямар размер өмссөнийг бичдэг. Өндөр, жингээ оруулахад хамгийн ойр модел, түүний өмссөн размер гарна. Энэ бол харьцуулалт: эргэлзвэл бидэнд бичээрэй, 48 цагийн дотор размераа солиулж ч болно.
          </p>
        </div>
      </section>

      <div className="wrap mt-10">
        <SizeFinder models={[...models.values()]} />
      </div>

      <section className="wrap mt-20" aria-labelledby="baby">
        <div className="rounded-[34px] bg-sage-l p-6 md:p-10">
          <h2 id="baby" className="text-[28px] md:text-[38px]">
            Хүүхдийн малгай: <span className="soft text-sage-d">насаар нь</span>
          </h2>
          <p className="mt-2 text-ink-2">Малгайн размер нь хүүхдийн насаар бичигдсэн. Насаа сонгоход тухайн размертай малгайнууд гарна.</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {AGE_STEPS.map((a) => {
              const n = hats.filter((p) => fitsAge(p, a).length).length;
              return (
                <Link key={a.id} href={`/shop?age=${a.id}`} className={`rounded-[22px] bg-white p-4 text-center ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-sage ${n ? "" : "pointer-events-none opacity-50"}`}>
                  <b className="display block text-[20px] font-medium">{a.label}</b>
                  <span className="text-[13px] text-ink-2">{n} малгай</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <p className="wrap mt-10 text-center text-[14.5px] text-ink-2">
        {business.rules.exchange} {business.rules.exchangeFee}
      </p>
    </div>
  );
}
