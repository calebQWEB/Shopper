import Link from "next/link";
import { categories } from "@/libs/constants";

const CategoryChips = ({ active }) => {
  return (
    <nav aria-label="Categories" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-2 pb-1">
        {categories.map((category) => {
          const isActive = category.name.toLowerCase() === active?.toLowerCase();
          return (
            <li key={category.id}>
              <Link
                href={`/categories/${encodeURIComponent(category.name)}`}
                aria-current={isActive ? "page" : undefined}
                className={`block whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition ${
                  isActive
                    ? "border-headline bg-headline text-white"
                    : "border-slate-300 text-slate-700 hover:border-headline"
                }`}
              >
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CategoryChips;
