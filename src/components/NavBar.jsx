"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  ChevronDown,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { categories } from "@/libs/constants";

const Logo = () => (
  <Link
    href="/"
    className="font-zen-dots text-lg tracking-wide text-headline sm:text-xl"
  >
    SHOPPER
  </Link>
);

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

const SearchForm = ({ className = "" }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={handleSubmit} role="search" className={`relative ${className}`}>
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products"
        aria-label="Search products"
        className="input rounded-full bg-slate-50 py-2 pl-9"
      />
    </form>
  );
};

const NavBar = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const cartCount = useSelector((state) =>
    state.product.cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
  );

  useEffect(() => setMenuOpen(false), [pathname]);

  const accountHref = user?.role === "ADMIN" ? "/controlpanel" : "/dashboard";

  const cartLink = (
    <Link
      href="/cart"
      aria-label={`Cart, ${cartCount} items`}
      className="relative grid h-10 w-10 place-items-center rounded-full text-headline hover:bg-slate-100"
    >
      <ShoppingCart size={20} />
      {cartCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-headline">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );

  return (
    <nav className="relative border-b border-slate-200">
      <div className="container-page flex h-16 items-center gap-4">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="-ml-2 grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100 lg:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Logo />

        <ul className="ml-6 hidden items-center gap-1 text-sm font-semibold lg:flex">
          <li className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-3 py-2 hover:bg-slate-100"
            >
              Categories
              <ChevronDown
                size={16}
                className="transition group-hover:rotate-180 group-focus-within:rotate-180"
              />
            </button>
            <div className="invisible absolute left-0 top-full w-[420px] pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="card grid grid-cols-2 gap-1 p-2 shadow-xl">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${encodeURIComponent(category.name)}`}
                    className="flex items-center gap-3 rounded-lg p-2 capitalize hover:bg-slate-50"
                  >
                    <Image
                      src={category.image}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </li>
          <li>
            <Link href="/#deals" className="block rounded-lg px-3 py-2 hover:bg-slate-100">
              Deals
            </Link>
          </li>
        </ul>

        <SearchForm className="mx-auto hidden w-full max-w-md md:block" />

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          {user ? (
            <Link
              href={accountHref}
              className="flex items-center gap-2 rounded-full p-1 pr-1 hover:bg-slate-100 sm:pr-3"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-headline text-xs font-bold text-white">
                {initials(user.name) || <UserRound size={16} />}
              </span>
              <span className="hidden text-sm font-semibold sm:inline">
                {user.role === "ADMIN" ? "Control panel" : "My account"}
              </span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                aria-label="Sign in"
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100 sm:hidden"
              >
                <UserRound size={20} />
              </Link>
              <Link href="/login" className="btn btn-ghost hidden sm:inline-flex">
                Sign in
              </Link>
              <Link href="/register" className="btn btn-primary hidden py-2 sm:inline-flex">
                Sign up
              </Link>
            </>
          )}
          {cartLink}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full max-h-[calc(100vh-6rem)] overflow-y-auto border-b border-slate-200 bg-white shadow-lg lg:hidden">
          <div className="container-page space-y-5 py-4">
            <SearchForm className="md:hidden" />

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Shop by category
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${encodeURIComponent(category.name)}`}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 p-2 text-sm font-medium capitalize"
                  >
                    <Image
                      src={category.image}
                      alt=""
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded object-cover"
                    />
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-1 text-sm font-semibold">
              <Link href="/#deals" className="rounded-lg px-2 py-2 hover:bg-slate-50">
                Deals
              </Link>
              {user ? (
                <Link href={accountHref} className="rounded-lg px-2 py-2 hover:bg-slate-50">
                  {user.role === "ADMIN" ? "Control panel" : "My account"}
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link href="/login" className="btn btn-outline">
                    Sign in
                  </Link>
                  <Link href="/register" className="btn btn-primary">
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
