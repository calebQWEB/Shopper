import { categories } from "@/libs/constants";
import CategoriesCard from "./ui/CategoriesCard";

const Categories = () => {
  return (
    <section id="categories" className="container-page scroll-mt-28 pt-12 sm:pt-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title">Shop by category</h2>
          <p className="mt-1 text-sm text-slate-500">
            Find exactly what you&apos;re looking for.
          </p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((item) => (
          <CategoriesCard key={item.id} name={item.name} image={item.image} />
        ))}
      </div>
    </section>
  );
};

export default Categories;
