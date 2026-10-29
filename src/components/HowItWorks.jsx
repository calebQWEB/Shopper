import Image from "next/image";
import { BadgeCheck, Globe, HandCoins, Search } from "lucide-react";
import { howItworksImages } from "@/libs/constants";

const steps = [
  {
    icon: Search,
    title: "Search for matches",
    description: "Search and filter from millions of products and suppliers.",
  },
  {
    icon: BadgeCheck,
    title: "Identify the right one",
    description: "Evaluate product quality and supplier capabilities.",
  },
  {
    icon: Globe,
    title: "Fulfill with transparency",
    description: "Ensure smooth transactions with trusted suppliers.",
  },
  {
    icon: HandCoins,
    title: "Pay with confidence",
    description: "Pay for your order in over 20 currencies.",
  },
];

const HowItWorks = () => {
  return (
    <section className="container-page pt-12 sm:pt-16">
      <h2 className="section-title max-w-2xl">
        Simplify ordering from discovery to delivery, all in one platform.
      </h2>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ icon: Icon, title, description }, index) => (
          <li key={title} className="card overflow-hidden">
            <div className="relative aspect-[4/3] bg-slate-100">
              <Image
                src={howItworksImages[index]}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              <span className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-bold text-headline shadow">
                {index + 1}
              </span>
            </div>
            <div className="p-4">
              <h3 className="flex items-center gap-2 font-semibold">
                <Icon size={18} className="shrink-0 text-headline" />
                {title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default HowItWorks;
