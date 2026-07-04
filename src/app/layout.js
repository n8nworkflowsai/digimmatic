import { Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import PageShell from "@/components/layout/PageShell";
import VercelInsights from "@/components/VercelInsights";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Scale Your Business with Digimmatic AI Automation",
  description:
    "Stop manual tasks at work. Digimmatic helps businesses including startups and SMBs scale, with powerful AI automation workflows tailored to your unique needs.",
  openGraph: {
    title: "Scale Your Business with Digimmatic AI Automation",
    description:
      "Stop manual tasks at work. Digimmatic helps businesses including startups and SMBs scale, with powerful AI automation workflows tailored to your unique needs.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <PageShell>{children}</PageShell>
        <VercelInsights />
      </body>
    </html>
  );
}
