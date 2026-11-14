import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";

const serif = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400"],
  variable: "--nf-serif",
  display: "swap",
});
const sans = Inter({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--nf-sans", display: "swap" });
const arabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500"],
  variable: "--nf-arabic",
  display: "swap",
});
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--nf-mono", display: "swap" });

// Title and description are rendered by I18nProvider so they follow the chosen language.
// TODO: add openGraph.images once /public/og.jpg (1200×630) exists.
export const metadata: Metadata = {};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${serif.variable} ${sans.variable} ${arabic.variable} ${mono.variable}`}>
      <body className="locked">{children}</body>
    </html>
  );
}
