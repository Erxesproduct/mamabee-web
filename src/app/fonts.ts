import { Lora, Noto_Sans } from "next/font/google";

// Both have Ө ө Ү ү (checked in the Google Fonts cmap).
/** Headings and prices: a soft, round-shouldered serif with a gentle italic, like a handwritten note to a new mother. */
export const display = Lora({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-lora", display: "swap" });
/** Body text, buttons and forms: a calm, very legible sans for reading on a phone at 3 a.m. */
export const body = Noto_Sans({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400", "500", "600", "700"], variable: "--font-noto", display: "swap" });
