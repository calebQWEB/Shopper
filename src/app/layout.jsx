import { Zen_Dots, Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "@/libs/provider";
import PathnameProvider from "@/components/PathnameProvider";
import Navigation from "@/components/Navigation";
import { CircleHelp } from "lucide-react";
import { PostHogProvider } from "@/libs/PostHogProvider";
import ServerPromo from "@/components/ServerPromo";

const zenDots = Zen_Dots({
  variable: "--font-zen-dots",
  subsets: ["latin"],
  weight: "400",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata = {
  title: "Shopper",
  description: "An e-commerce site",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${zenDots.variable} ${montserrat.variable} antialiased relatives`}
      >
        {/* <PathnameProvider /> */}
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
          <ServerPromo />
          <Navigation />
        </div>
        <Providers>
          <div className="mx-auto">{children}</div>
        </Providers>

        <button className="z-40 p-2 flex items-center justify-between gap-3 fixed bottom-10 left-10 bg-green-600 text-white rounded-full transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
          <CircleHelp size={30} />
        </button>
      </body>
    </html>
  );
}
