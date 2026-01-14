import "@/styles/index.css";
import { AuthProvider } from "@/context/AuthProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { BacktestMonitorWrapper } from "@/components/BacktestMonitorWrapper";

// Build: 2026-01-14-v6-geometric-design
const BUILD_VERSION = "2026-01-14-v6";
if (typeof window !== 'undefined') {
  console.log(`[Algotcha] App build: ${BUILD_VERSION}`);
}

export const metadata = {
  title: {
    default: "Algotcha - Market Analysis Platform",
    template: "%s | Algotcha"
  },
  description: "Automate your market analysis with powerful analytical models. Backtest on 5 years of real data. SaaS platform for data research and strategy simulation.",
  keywords: ["market analysis", "data analytics", "backtest", "strategy simulation", "SaaS platform", "analytical models", "data research"],
  authors: [{ name: "Algotcha" }],
  creator: "Algotcha",
  metadataBase: new URL("https://algotcha.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://algotcha.com",
    siteName: "Algotcha",
    title: "Algotcha - Market Analysis Platform",
    description: "Automate your market analysis with powerful analytical models. Backtest on 5 years of real data. SaaS platform for data research.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Algotcha - Algorithmic Trading Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Algotcha - Market Analysis Platform",
    description: "Automate your market analysis with powerful analytical models. Backtest on 5 years of real data.",
    images: ["/og-image.png"],
    creator: "@algotcha",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <LanguageProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <BacktestMonitorWrapper />
            <CookieConsent />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
