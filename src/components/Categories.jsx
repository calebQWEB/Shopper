import { categories } from "@/libs/constants";
import { styles } from "@/libs/styles";
import CategoriesCard from "./ui/CategoriesCard";

const Categories = () => {
  return (
    <section className={`${styles.padding} text-center md:text-start`}>
      <h1 className={`${styles.sectionHeadText} font-montserrat`}>
        Shop from our categories
      </h1>
      <div className="mt-5 flex flex-col md:flex-row gap-2 justify-between items-center">
        {categories.map((item) => (
          <CategoriesCard key={item.id} name={item.name} image={item.image} />
        ))}
      </div>
    </section>
  );
};

export default Categories;
