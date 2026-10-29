import Image from "next/image";
import Link from "next/link";

const CategoriesCard = ({ image, name }) => {
  return (
    <Link
      href={`/categories/${encodeURIComponent(name)}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-slate-100"
    >
      <Image
        src={image}
        alt={name}
        fill
        sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
        className="object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3">
        <h3 className="text-sm font-bold capitalize text-white sm:text-base">
          {name}
        </h3>
        <p className="text-xs text-white/80 transition group-hover:text-accent">
          Shop now →
        </p>
      </div>
    </Link>
  );
};

export default CategoriesCard;
