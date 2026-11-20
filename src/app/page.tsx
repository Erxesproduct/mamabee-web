import Image from "next/image";
import Link from "next/link";
import { Bee, BeeFlight, Cloud, CloudEdge } from "@/components/brand";
import { ArrowIcon, ChatIcon, ClockIcon, GiftIcon, QrIcon, TruckIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Scroller } from "@/components/scroller";
import { business } from "@/content/business";
import { AGE_STEPS, banners, card, fitsAge, getProduct, popular, posts, products, shelf, WHO } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const byId = (id: number) => products.find((p) => p.id === id);
const TONE: Record<string, string> = { blush: "bg-blush", sage: "bg-sage-l", honey: "bg-honey-l", cloud: "bg-sky" };

/** The fabrics, in the shop's own words from the product pages. */
const FABRICS = [
  { name: "Waffle", mn: "Ваффл", text: "Хөвөн даавууг 3D эффекттэй нэхсэн. Агаар сайн нэвтрүүлж, ус сайн шингээдэг тул амархан халууцдаг, төрсний дараа их хөлөрдөг үед тохирно. Хурдан хатаж, бага үрчийнэ.", where: "Халад", href: "/shop?g=mama&s=Халад", tone: "bg-sage-l" },
  { name: "TENCEL™ Modal", mn: "Модал", text: "Байгалийн гаралтай модны целлюлозоос гаргасан даавуу. Хөвөнгөөс ч илүү зөөлөн, амьсгалдаг, суналттай.", where: "Кимоно, пижама хослол", href: "/shop?g=mama&s=Хослол", tone: "bg-blush-l" },
  { name: "Pointelle", mn: "Пойнтелл", text: "Маш зөөлөн, суналттай тул жирэмсэн биед тав тухтай. Агаар сайн нэвтрүүлнэ.", where: "Шорт, майкны хослол", href: "/shop?g=mama&s=Хослол", tone: "bg-honey-l" },
  { name: "Muslin & linen", mn: "Муслин, маалинга", text: "2 давхар муслин гадартай хөхүүл дэр, муслин lovey, pouch. 70% linen 30% cotton Comfy huggy.", where: "Хөхүүл үе, хүүхдэд", href: "/shop?g=nursing", tone: "bg-sky" },
];

export default function Home() {
  const banner = banners[0];
  const heroA = byId(634933) ?? popular[0];
  const heroB = byId(595810) ?? popular[1];
  const heroC = byId(572625) ?? popular[2];
  const best = popular.filter((p) => p.best >= 0).slice(0, 12);
  const sets = shelf.filter((p) => p.group === "sets");
  const hats = shelf.filter((p) => p.ages.length);
  const fitSamples = [
    { p: byId(634932), note: "Кимоно сет" },
    { p: byId(595810), note: "Ваффл халад" },
    { p: byId(559395), note: "Унтлагын хослол" },
  ].filter((x) => x.p?.fit);
  const last = shelf.filter((p) => p.last);
  const huggy = getProduct("comfy-huggy-baby-pink");

  return (
    <>
      {/* the owner's own banner comes first, as on the old shop */}
      {banner && (
        <div className="wrap pt-4 md:pt-6">
          <Link href="/shop?g=mama" className="rise relative block overflow-hidden rounded-[22px] md:rounded-[30px]">
            <Image src={banner.src} alt={`${banner.title}: Love your journey`} width={banner.w} height={banner.h} priority sizes="(min-width: 1240px) 1184px, 100vw" className="h-auto w-full" />
          </Link>
        </div>
      )}

      {/* hero */}
      <section className="relative overflow-hidden">
        <Cloud className="drift absolute top-10 -left-10 w-44 opacity-90 md:w-64" color="var(--color-cloud)" />
        <Cloud className="drift absolute right-[-30px] bottom-8 w-52 opacity-80 [animation-delay:-6s] md:w-72" color="var(--color-blush-l)" />
        <div className="wrap relative grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="kicker rise">
              <Bee size={20} /> Comfort for your motherhood era
            </p>
            <h1 className="rise mt-4 text-[44px] leading-[1.02] text-ink sm:text-[60px] lg:text-[76px]" style={{ ["--d" as string]: "80ms" }}>
              Love your <span className="soft text-sage-d">journey</span>
            </h1>
            <p className="soft rise mt-4 text-[24px] text-ink-2 md:text-[30px]" style={{ ["--d" as string]: "160ms" }}>
              {business.motto}
            </p>
            <p className="rise mt-5 max-w-lg text-[16.5px] text-ink-2" style={{ ["--d" as string]: "240ms" }}>
              Жирэмсэн байхаас эхлээд хөхүүл үе, бяцхан үрийнхээ анхны жилүүдэд ээжийг эвтэйхэн, амьсгалдаг, зөөлөн хувцас, хэрэгслээр хүрээлнэ.
            </p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ ["--d" as string]: "320ms" }}>
              <Link href="/shop?g=mama" className="btn btn-ink">
                Ээжийн хувцас <ArrowIcon size={17} />
              </Link>
              <Link href="/size" className="btn btn-line">
                Размераа олох
              </Link>
            </div>
            <p className="rise mt-7 flex items-center gap-3 text-[14px] text-ink-2" style={{ ["--d" as string]: "400ms" }}>
              <span className="flex -space-x-2">
                {[heroA, heroB, heroC].map((p) => p?.images[0] && <Image key={p.id} src={p.images[0].thumb.src} alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover ring-2 ring-milk" />)}
              </span>
              Facebook-т {business.followers} ээж MamaBee-г дагадаг
            </p>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[540px]">
            <div className="absolute -top-6 right-0 left-0 hidden origin-top-left scale-[.85] sm:block md:scale-100">
              <BeeFlight />
            </div>
            {heroA?.images[0] && (
              <Link href={`/p/${heroA.slug}`} className="cloud-frame breathe absolute top-[8%] left-[4%] h-[64%] w-[58%] overflow-hidden bg-blush shadow-[0_30px_60px_-30px_rgb(59_63_69/0.45)]">
                <Image src={heroA.images[0].src} alt={heroA.title} fill priority sizes="320px" className="object-cover" />
              </Link>
            )}
            {heroB?.images[0] && (
              <Link href={`/p/${heroB.slug}`} className="blob absolute top-[30%] right-[2%] h-[52%] w-[44%] overflow-hidden bg-sage-l shadow-[0_30px_60px_-30px_rgb(59_63_69/0.45)] ring-[6px] ring-milk">
                <Image src={heroB.images[0].src} alt={heroB.title} fill sizes="240px" className="object-cover" />
              </Link>
            )}
            {heroC?.images[0] && (
              <Link href={`/p/${heroC.slug}`} className="absolute bottom-[2%] left-[22%] h-[30%] w-[30%] overflow-hidden rounded-full bg-honey-l shadow-[0_20px_40px_-20px_rgb(59_63_69/0.5)] ring-[6px] ring-milk">
                <Image src={heroC.images[0].thumb.src} alt={heroC.title} fill sizes="170px" className="object-cover" />
              </Link>
            )}
            <span className="bob absolute right-[8%] bottom-[6%] rounded-full bg-white px-4 py-2 text-[13.5px] font-semibold shadow-lg ring-1 ring-line">☁️ Зөөлөн, амьсгалдаг</span>
          </div>
        </div>
      </section>

      {/* for whom */}
      <section className="wrap" aria-labelledby="who">
        <Reveal>
          <h2 id="who" className="text-[30px] md:text-[40px]">
            Танд юу <span className="soft text-sage-d">хэрэгтэй</span> вэ?
          </h2>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {WHO.map((w, i) => {
            const pick = popular.find((p) => p.group === w.id && p.images[0]);
            return (
              <Reveal key={w.id} delay={i * 80}>
                <Link href={`/shop?g=${w.id}`} className={`group relative flex h-full min-h-[230px] flex-col overflow-hidden rounded-[28px] p-5 ${TONE[w.tone]} md:min-h-[300px] md:p-6`}>
                  <span className="relative z-10">
                    <b className="display block text-[20px] leading-tight font-medium md:text-[25px]">{w.title}</b>
                    <span className="mt-1.5 block text-[13.5px] text-ink-2 md:text-[14.5px]">{w.line}</span>
                  </span>
                  {pick && (
                    <span className="cloud-frame absolute -right-6 -bottom-8 h-[58%] w-[78%] overflow-hidden ring-[5px] ring-white/70 transition duration-700 group-hover:-translate-y-2 group-hover:rotate-2">
                      <Image src={pick.images[0].thumb.src} alt="" fill sizes="220px" className="object-cover" />
                    </span>
                  )}
                  <span className="relative z-10 mt-auto grid h-10 w-10 place-items-center rounded-full bg-white transition group-hover:bg-ink group-hover:text-milk">
                    <ArrowIcon size={17} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* bestsellers */}
      <section className="mt-20" aria-labelledby="best">
        <div className="wrap flex items-end justify-between gap-4">
          <Reveal>
            <p className="kicker">Ээжүүдийн сонголт</p>
            <h2 id="best" className="mt-2 text-[30px] md:text-[40px]">
              Хамгийн их <span className="soft text-sage-d">захиалагддаг</span>
            </h2>
          </Reveal>
          <Link href="/shop" className="hidden shrink-0 items-center gap-2 font-semibold text-sage-d hover:underline sm:inline-flex">
            Бүгдийг үзэх <ArrowIcon size={16} />
          </Link>
        </div>
        <div className="wrap mt-7">
          <Scroller label="Их захиалгатай бараа" className="snap-row no-scrollbar -mx-4 px-4 pb-2 md:mx-0 md:px-0">
            {best.map((p, i) => (
              <div key={p.id} className="w-[46vw] max-w-[270px] sm:w-[240px]">
                <ProductCard p={p} i={i} />
              </div>
            ))}
          </Scroller>
        </div>
      </section>

      {/* size helper */}
      <section className="mt-20">
        <CloudEdge color="var(--color-milk)" className="bg-blush-l" />
        <div className="bees bg-blush-l py-14 [--bee-color:var(--color-rose)] [--bee-opacity:.06] md:py-20">
          <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1.25fr]">
            <Reveal>
              <p className="kicker text-rose">Размер туслах</p>
              <h2 className="mt-2 text-[32px] md:text-[44px]">
                Гэдэс томрох тусам <span className="soft text-rose">аль размер</span> тохирох вэ?
              </h2>
              <p className="mt-4 max-w-md text-ink-2">
                Бүх зурган дээр модел ээж ямар өндөр, жинтэй, ямар размер өмссөнийг бичсэн. Өөрийнхөө өндөр, жинг оруулаад хамгийн ойр моделийг олоорой.
              </p>
              <Link href="/size" className="btn btn-ink mt-7">
                Размераа олох <ArrowIcon size={17} />
              </Link>
            </Reveal>
            <div className="grid gap-3 sm:grid-cols-3">
              {fitSamples.map(({ p, note }, i) => (
                <Reveal key={p!.id} delay={i * 90}>
                  <Link href={`/p/${p!.slug}`} className="group block overflow-hidden rounded-[26px] bg-white ring-1 ring-line transition hover:-translate-y-1">
                    <span className="relative block aspect-[4/5] overflow-hidden">
                      <Image src={p!.images[0].thumb.src} alt={p!.title} fill sizes="240px" className="object-cover transition duration-700 group-hover:scale-105" />
                      <span className="display absolute top-3 right-3 grid h-12 w-12 place-items-center rounded-full bg-white text-[17px] font-semibold shadow">{p!.fit!.size}</span>
                    </span>
                    <span className="block p-4">
                      <b className="block text-[15px] font-semibold">{note}</b>
                      <span className="mt-0.5 block text-[13.5px] text-ink-2">
                        {p!.fit!.height} см{p!.fit!.weight ? `, ${p!.fit!.weight} кг` : ""}
                        {p!.fit!.before ? ` (өмнө нь ${p!.fit!.before} кг)` : ""}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
        <CloudEdge color="var(--color-blush-l)" flip />
      </section>

      {/* baby age → hats */}
      <section className="wrap mt-16" aria-labelledby="hats">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="kicker">Хүүхдийн малгай</p>
            <h2 id="hats" className="mt-2 text-[30px] md:text-[40px]">
              Бяцхан үр тань <span className="soft text-sage-d">хэдэн сартай</span> вэ?
            </h2>
            <p className="mt-3 max-w-md text-ink-2">Насаа сонгоход тэр размер нь байгаа малгайнууд л гарч ирнэ. Bucket hat, brim bonnet, linen bonnet: {hats.length} загвар.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {AGE_STEPS.map((a) => {
                const n = hats.filter((p) => fitsAge(p, a).length).length;
                return (
                  <Link key={a.id} href={`/shop?age=${a.id}`} className="chip" aria-disabled={n === 0 || undefined}>
                    {a.label}
                    <span className="rounded-full bg-cloud px-1.5 text-[12px] text-ink-2">{n}</span>
                  </Link>
                );
              })}
            </div>
          </Reveal>
          <Scroller label="Хүүхдийн малгай" className="snap-row no-scrollbar -mx-4 px-4 pb-2 md:mx-0 md:px-0">
            {hats.slice(0, 10).map((p, i) => (
              <div key={p.id} className="w-[42vw] max-w-[210px]">
                <ProductCard p={p} i={i + 1} />
              </div>
            ))}
          </Scroller>
        </div>
      </section>

      {/* fabrics */}
      <section className="wrap mt-24" aria-labelledby="fabrics">
        <Reveal className="text-center">
          <p className="kicker">Материал</p>
          <h2 id="fabrics" className="mx-auto mt-2 max-w-2xl text-[30px] md:text-[42px]">
            Арьсанд хүрэх бүхэн <span className="soft text-sage-d">зөөлөн</span> байх ёстой
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FABRICS.map((f, i) => (
            <Reveal key={f.name} delay={i * 80}>
              <Link href={f.href} className={`group flex h-full flex-col rounded-[28px] p-6 ${f.tone} transition hover:-translate-y-1`}>
                <span className="soft text-[28px] leading-none text-ink">{f.name}</span>
                <span className="mt-1 text-[13px] font-semibold tracking-wide text-ink-3 uppercase">{f.mn}</span>
                <p className="mt-4 text-[14.5px] text-ink-2">{f.text}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[14px] font-semibold text-sage-d">
                  {f.where} <ArrowIcon size={15} className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* gift sets */}
      <section className="mt-24">
        <div className="wrap">
          <div className="bees relative overflow-hidden rounded-[36px] bg-sage-l p-6 [--bee-color:var(--color-sage-d)] [--bee-opacity:.07] md:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.6fr] lg:items-center">
              <Reveal>
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white">
                  <GiftIcon size={26} />
                </span>
                <h2 className="mt-5 text-[30px] md:text-[42px]">
                  Шинэ ээжид <span className="soft text-sage-d">бэлэглэх</span>
                </h2>
                <p className="mt-3 max-w-md text-ink-2">Найз, дүү, эхнэртээ: халад, хослол, хөхүүл дэр, lovey-г нэг дор багцалсан бэлэн багцууд.</p>
                {card && (
                  <p className="mt-5 rounded-2xl bg-white/80 p-4 text-[14px] text-ink-2">
                    <b className="text-ink">+ Мэндчилгээний карт {formatPrice(card.variants[0].price)}</b> сагсан дээр нэмж болно. {business.rules.card}
                  </p>
                )}
              </Reveal>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {sets.slice(0, 4).map((p, i) => (
                  <ProductCard key={p.id} p={p} i={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* comfy huggy */}
      {huggy?.images[1] && (
        <section className="wrap mt-24">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
            <Reveal className="relative">
              <div className="cloud-frame relative aspect-square overflow-hidden bg-blush">
                <Image src={huggy.images[1].src} alt={huggy.title} fill sizes="(min-width: 768px) 560px, 100vw" className="object-cover" />
              </div>
              <Cloud className="drift absolute -bottom-6 -left-4 w-36" color="var(--color-honey-l)" />
            </Reveal>
            <Reveal delay={100}>
              <p className="kicker">Comfy huggy</p>
              <h2 className="mt-2 text-[30px] md:text-[42px]">
                Хоёуланд нь <span className="soft text-sage-d">тухтай</span> тэвэрт
              </h2>
              <ul className="mt-5 space-y-3 text-ink-2">
                {huggy.lines.slice(1, 6).map((l) => (
                  <li key={l} className="flex gap-3">
                    <Bee size={18} className="mt-1 shrink-0" />
                    {l}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link href={`/p/${huggy.slug}`} className="btn btn-ink">
                  Comfy huggy үзэх
                </Link>
                <span className="display text-[22px] font-semibold">
                  {formatPrice(huggy.variants[0].price)} {huggy.variants[0].compareAt && <s className="text-[15px] font-normal text-ink-3">{formatPrice(huggy.variants[0].compareAt)}</s>}
                </span>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* last sizes */}
      {last.length > 0 && (
        <section className="wrap mt-24" aria-labelledby="last">
          <div className="flex items-end justify-between gap-4">
            <Reveal>
              <p className="kicker text-rose">Last sizes</p>
              <h2 id="last" className="mt-2 text-[30px] md:text-[40px]">
                Сүүлийн <span className="soft text-rose">размерууд</span>
              </h2>
            </Reveal>
            <Link href="/shop?last=1" className="hidden shrink-0 items-center gap-2 font-semibold text-rose hover:underline sm:inline-flex">
              Бүгд <ArrowIcon size={16} />
            </Link>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-6">
            {last.map((p, i) => (
              <ProductCard key={p.id} p={p} i={i + 2} />
            ))}
          </div>
        </section>
      )}

      {/* journal */}
      <section className="wrap mt-24" aria-labelledby="journal">
        <Reveal>
          <p className="kicker">Зөвлөгөө</p>
          <h2 id="journal" className="mt-2 text-[30px] md:text-[40px]">
            Ээжүүдэд <span className="soft text-sage-d">хэрэгтэй</span> мэдээлэл
          </h2>
        </Reveal>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((p, i) => (
            <Reveal key={p.id} delay={i * 70}>
              <Link href={`/journal/${p.slug}`} className="group block h-full overflow-hidden rounded-[26px] bg-white ring-1 ring-line transition hover:-translate-y-1">
                {p.image && (
                  <span className="relative block aspect-[4/3] overflow-hidden bg-cloud">
                    <Image src={p.image.thumb.src} alt="" fill sizes="(min-width: 1024px) 290px, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  </span>
                )}
                <span className="block p-5">
                  <b className="display block text-[18px] leading-snug font-medium">{p.title}</b>
                  <span className="mt-2 line-clamp-2 text-[14px] text-ink-2">{p.body[0]}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* promises */}
      <section className="wrap mt-24" aria-label="Хүргэлт, төлбөр">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: TruckIcon, t: `${business.zone.name}: ${formatPrice(business.zone.price)}`, d: `${formatPrice(business.zone.freeOver)}-өөс дээш бол үнэгүй`, tone: "bg-sage-l" },
            { Icon: ClockIcon, t: "24–48 цагт хүргэнэ", d: "Хүргэлтийн компанийн агуулахаас", tone: "bg-honey-l" },
            { Icon: QrIcon, t: "QPay-ээр төлнө", d: "Аль ч банкны аппаар, 10 минутын дотор", tone: "bg-sky" },
            { Icon: ChatIcon, t: "48 цагт размер солино", d: "Хүргэлтээр, 6,000₮ нэмэгдэнэ", tone: "bg-blush-l" },
          ].map(({ Icon, t, d, tone }) => (
            <Link key={t} href="/info" className={`flex items-center gap-4 rounded-[24px] p-5 ${tone} transition hover:-translate-y-0.5`}>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white">
                <Icon size={22} />
              </span>
              <span>
                <b className="block text-[15.5px] font-semibold">{t}</b>
                <span className="text-[13.5px] text-ink-2">{d}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* #mamabeemoments */}
      <section className="wrap mt-20">
        <Reveal>
          <a href={business.instagram} target="_blank" rel="noreferrer" className="bees group relative block overflow-hidden rounded-[36px] bg-ink px-6 py-12 text-center text-milk [--bee-color:#fff] [--bee-opacity:.035] md:py-16">
            <p className="soft text-[34px] md:text-[52px]">#mamabeemoments</p>
            <p className="mx-auto mt-3 max-w-xl text-milk/80">Ээж байхын гайхалтай, заримдаа сорилттой мөчүүдээ хаштагаар хуваалцаарай. Таны хайраар дүүрэн мөч энэ булангийн нэг хэсэг болж болно.</p>
            <span className="btn btn-honey mt-7">{business.instagramHandle}</span>
          </a>
        </Reveal>
      </section>
    </>
  );
}
