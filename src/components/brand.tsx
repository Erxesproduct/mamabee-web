import Image from "next/image";

/** The MamaBee lockup (bee + «mama bee»), the shop's own logo with a transparent background. */
export function Logo({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return <Image src="/brand/logo.png" alt="MamaBee" width={2873} height={1024} priority={priority} className={className} />;
}

/** The bee mark alone. */
export function Bee({ size = 40, white = false, className = "" }: { size?: number; white?: boolean; className?: string }) {
  return <Image src={white ? "/brand/bee-white.png" : "/brand/bee.png"} alt="" width={size} height={Math.round(size * 1.05)} className={className} aria-hidden />;
}

/** A soft cloud. */
export function Cloud({ className = "", color = "#fff" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 220 110" className={className} aria-hidden>
      <path
        fill={color}
        d="M48 104c-24 0-42-15-42-35 0-19 16-34 37-35 6-18 24-30 45-30 19 0 35 9 43 23 6-3 13-5 20-5 24 0 43 17 44 39 14 4 23 15 23 26 0 10-9 17-21 17H48Z"
      />
    </svg>
  );
}

/** The bottom edge of a section as a row of cloud puffs (put it at the top of the next section, coloured like the previous one). */
export function CloudEdge({ color, flip = false, className = "" }: { color: string; flip?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className={`block h-8 w-full md:h-12 ${flip ? "rotate-180" : ""} ${className}`} aria-hidden>
      <path
        fill={color}
        d="M0 0h1440v22c-30 0-48 20-80 20s-46-26-86-26-52 30-94 30-54-22-92-22-52 28-96 28-50-34-96-34-56 30-100 30-48-20-86-20-56 26-98 26-52-30-94-30-50 24-90 24-46-28-88-28-56 30-96 30S70 18 40 18 12 26 0 26V0Z"
      />
    </svg>
  );
}

/** The bee flying a dotted loop (decoration; the bee stays still for reduced motion). */
export function BeeFlight({ className = "" }: { className?: string }) {
  const d = "M20 150 C 80 40, 200 30, 240 100 S 360 190, 420 90 S 540 20, 580 70";
  return (
    // fixed 600×200 so the CSS offset-path (in px) matches the drawn path; scale it from outside
    <div className={`pointer-events-none relative h-[200px] w-[600px] ${className}`} aria-hidden>
      <svg viewBox="0 0 600 200" width="600" height="200" className="overflow-visible">
        <path d={d} fill="none" stroke="var(--color-sage)" strokeWidth="2.2" strokeDasharray="2 10" strokeLinecap="round" className="dash-move" />
      </svg>
      <span className="flying-bee absolute top-0 left-0 block h-9 w-9" style={{ offsetPath: `path("${d}")` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/bee.png" alt="" className="h-full w-full -rotate-90 object-contain" />
      </span>
    </div>
  );
}
