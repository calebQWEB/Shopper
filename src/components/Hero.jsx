import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  PackageSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const perks = [
  { icon: ShieldCheck, title: "Secure checkout", text: "Payments via Paystack" },
  { icon: BadgeCheck, title: "Trusted suppliers", text: "Genuine products only" },
  { icon: Sparkles, title: "Premium quality", text: "Hand-picked collections" },
  { icon: PackageSearch, title: "Track your orders", text: "Right from your account" },
];

const Hero = () => {
  return (
    <section className="container-page pt-4 sm:pt-6">
      <div className="relative overflow-hidden rounded-2xl bg-night">
        <Image
          src="/heroImage-1.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/80 to-night/30 sm:bg-gradient-to-r sm:via-night/75 sm:to-transparent" />

        <div className="relative max-w-xl px-6 py-14 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Premium tech store
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">
            Where elegance meets convenience.
          </h1>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Shop exclusive collections with premium quality and seamless
            shopping.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#categories" className="btn btn-accent px-5 py-3">
              Shop now
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#deals"
              className="btn border border-white/30 px-5 py-3 text-white hover:bg-white/10"
            >
              View deals
            </Link>
          </div>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {perks.map(({ icon: Icon, title, text }) => (
          <li key={title} className="card flex items-center gap-3 p-3 sm:p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-headline">
              <Icon size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{title}</p>
              <p className="truncate text-xs text-slate-500">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Hero;
