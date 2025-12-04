import "@/styles/index.css";
import { AuthProvider } from "@/context/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: {
    default: "Algotcha - Algorithmic Crypto Trading Made Simple",
    template: "%s | Algotcha"
  },
  description: "Automate your crypto trading with proven algorithmic strategies. Backtest on 5 years of real data, connect your exchange, and trade 24/7. Support for Binance, Bybit, and OKX.",
  keywords: ["algorithmic trading", "crypto trading", "trading bot", "binance bot", "automated trading", "backtest", "RSI", "MACD", "trading strategy", "bitcoin", "ethereum"],
  authors: [{ name: "Algotcha" }],
  creator: "Algotcha",
  metadataBase: new URL("https://algotcha.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://algotcha.com",
    siteName: "Algotcha",
    title: "Algotcha - Algorithmic Crypto Trading Made Simple",
    description: "Automate your crypto trading with proven algorithmic strategies. Backtest on 5 years of real data, connect your exchange, and trade 24/7.",
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
    title: "Algotcha - Algorithmic Crypto Trading Made Simple",
    description: "Automate your crypto trading with proven algorithmic strategies. Backtest on 5 years of real data.",
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
