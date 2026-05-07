import type { Metadata, Viewport } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ladarka.fr"),
  title: {
    default: "La Darka — Burgers & Street Food à Lyon",
    template: "%s · La Darka",
  },
  description:
    "Smash burgers, ailes BBQ, sandwichs maison. Commandez en ligne, livraison Lyon ou click & collect. La Darka, le goût de la rue version premium.",
  openGraph: {
    title: "La Darka — Burgers & Street Food à Lyon",
    description:
      "Smash burgers, ailes BBQ, sandwichs maison. Livraison Lyon & click & collect.",
    url: "https://ladarka.fr",
    siteName: "La Darka",
    locale: "fr_FR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0a0908",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${sans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full grain flex flex-col">
        <SmoothScroll />
        <Header />
        <main className="flex-1 relative z-[2]">{children}</main>
        <Footer />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            },
          }}
        />
      </body>
    </html>
  );
}
