"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { categories } from "@/libs/constants";

// The control panel has its own full-height layout
const hiddenOn = ["/controlpanel"];

const Footer = () => {
  const pathname = usePathname();
  if (hiddenOn.some((path) => pathname.startsWith(path))) return null;

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link href="/" className="font-zen-dots text-lg text-headline">
            SHOPPER
          </Link>
          <p className="mt-3 max-w-sm text-sm text-slate-600">
            Where elegance meets convenience. Premium tech from trusted
            suppliers, with a seamless checkout.
          </p>
          <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={16} className="text-emerald-600" />
            Secure payments powered by Paystack
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-headline">Shop</h3>
          <ul className="mt-3 grid gap-2 text-sm text-slate-600">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categories/${encodeURIComponent(category.name)}`}
                  className="capitalize hover:text-headline"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-headline">Account</h3>
          <ul className="mt-3 grid gap-2 text-sm text-slate-600">
            <li>
              <Link href="/dashboard" className="hover:text-headline">
                My account & orders
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-headline">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-headline">
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-headline">
                Create an account
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <p className="container-page py-4 text-xs text-slate-500">
          © {new Date().getFullYear()} Shopper. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
