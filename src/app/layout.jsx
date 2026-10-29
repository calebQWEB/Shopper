import { Zen_Dots, Montserrat } from "next/font/google";
import "./globals.css";
import { PersistedContent, StoreProvider } from "@/libs/provider";
import Navigation from "@/components/Navigation";
import ServerPromo from "@/components/ServerPromo";
import Footer from "@/components/Footer";
import ItemAddedToCart from "@/components/ui/ItemAddedToCart";
import HideOnAdmin from "@/components/HideOnAdmin";

const zenDots = Zen_Dots({
  variable: "--font-zen-dots",
  subsets: ["latin"],
  weight: "400",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata = {
  title: {
    default: "Shopper — Premium tech, delivered",
    template: "%s | Shopper",
  },
  description:
    "Shop laptops, smartphones, tablets, headphones, smartwatches and gaming consoles.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${zenDots.variable} ${montserrat.variable} font-montserrat antialiased flex min-h-screen flex-col bg-white text-headline`}
      >
        <StoreProvider>
          <HideOnAdmin>
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
              <ServerPromo />
              <Navigation />
            </header>
          </HideOnAdmin>

          <main className="flex-1">
            <PersistedContent>{children}</PersistedContent>
          </main>

          <Footer />
          <ItemAddedToCart />
        </StoreProvider>
      </body>
    </html>
  );
}
