import Image from "next/image";
import Link from "next/link";

const CategoriesCard = ({ image, name }) => {
  return (
    <Link
      href={`/categories/${encodeURIComponent(name)}`}
      className="cursor-pointer relative w-[350px] h-[300px] md:w-[200] md:h-[300]"
    >
      <Image src={image} alt={name} fill className="rounded-md object-cover" />

      <h2 className="absolute inset-0 flex items-center justify-center font-bold font-montserrat text-md sm:text-base lg:text-xl text-white bg-black/50 rounded-md">
        {name}
      </h2>
    </Link>
  );
};

export default CategoriesCard;
