import { Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import PageShell from "@/components/layout/PageShell";
import { resolveSiteUrl } from "@/lib/site-url";
import { getApolloAppId } from "@/lib/apollo";
import {
  getGaMeasurementId,
  getGtmId,
  GOOGLE_CONSENT_DENIED,
} from "@/lib/analytics";
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

const siteUrl = resolveSiteUrl();

const gaMeasurementId = getGaMeasurementId();
const gtmId = getGtmId();
const apolloAppId = getApolloAppId();
const isProduction = process.env.NODE_ENV === "production";

const consentDefaultScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', ${JSON.stringify({
  ...GOOGLE_CONSENT_DENIED,
  wait_for_update: 500,
})});
`;

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
      data-scroll-behavior="smooth"
      className={`${hankenGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Script
          id="google-consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: consentDefaultScript }}
        />
        <PageShell>{children}</PageShell>
        <AnalyticsProvider
          gaId={gaMeasurementId}
          gtmId={gtmId}
          apolloAppId={apolloAppId}
          enableGoogleAnalytics={isProduction}
        />
      </body>
    </html>
  );
}
