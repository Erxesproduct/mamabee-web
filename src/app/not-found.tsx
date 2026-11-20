import Link from "next/link";
import { Bee, Cloud } from "@/components/brand";

export default function NotFound() {
  return (
    <div className="wrap relative py-20 text-center">
      <Cloud className="drift mx-auto w-48" color="var(--color-cloud)" />
      <Bee size={56} className="bob mx-auto -mt-16" />
      <h1 className="mt-8 text-[32px] md:text-[46px]">
        Зөгий <span className="soft text-sage-d">замаа алдчихлаа</span>
      </h1>
      <p className="mt-2 text-ink-2">Хуудас олдсонгүй. Хаяг буруу эсвэл бараа шилжсэн байж магадгүй.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-ink">
          Бүх бараа
        </Link>
        <Link href="/" className="btn btn-line">
          Нүүр хуудас
        </Link>
      </div>
    </div>
  );
}
