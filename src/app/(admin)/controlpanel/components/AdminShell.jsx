"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Box,
  ExternalLink,
  Gift,
  LayoutGrid,
  LogOut,
  Menu,
  Package,
  Users,
  X,
} from "lucide-react";

const navItems = [
  { href: "/controlpanel", label: "Dashboard", icon: LayoutGrid, match: (p) => p === "/controlpanel" },
  { href: "/controlpanel/orders", label: "Orders", icon: Package, match: (p) => p.startsWith("/controlpanel/orders") },
  { href: "/controlpanel/products", label: "Products", icon: Box, match: (p) => p.startsWith("/controlpanel/product") },
  { href: "/controlpanel/customers", label: "Customers", icon: Users, match: (p) => p.startsWith("/controlpanel/customer") },
  { href: "/controlpanel/promotions", label: "Promotions", icon: Gift, match: (p) => p.startsWith("/controlpanel/promotions") },
];

const SidebarContent = ({ pathname, userName }) => (
  <div className="flex h-full flex-col">
    <div className="flex h-16 items-center gap-2 px-5">
      <Link href="/controlpanel" className="font-zen-dots text-lg text-headline">
        SHOPPER
      </Link>
      <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
        Admin
      </span>
    </div>

    <nav aria-label="Control panel" className="flex-1 px-3 py-2">
      <ul className="grid gap-1">
        {navItems.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  active ? "bg-headline text-white" : "text-slate-600 hover:bg-slate-100 hover:text-headline"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>

    <div className="grid gap-1 border-t border-slate-200 p-3 text-sm font-semibold">
      <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">
        <ExternalLink size={18} />
        View store
      </Link>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-rose-600 hover:bg-rose-50"
      >
        <LogOut size={18} />
        Sign out
      </button>
      {userName && <p className="truncate px-3 pt-2 text-xs font-normal text-slate-500">Signed in as {userName}</p>}
    </div>
  </div>
);

const AdminShell = ({ userName, children }) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[232px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-slate-200 bg-white lg:block">
        <SidebarContent pathname={pathname} userName={userName} />
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="-ml-2 grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100"
          >
            <Menu size={20} />
          </button>
          <span className="font-zen-dots text-headline">SHOPPER</span>
          <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold uppercase">Admin</span>
        </header>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-black/40"
            />
            <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100"
              >
                <X size={18} />
              </button>
              <SidebarContent pathname={pathname} userName={userName} />
            </div>
          </div>
        )}

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminShell;
