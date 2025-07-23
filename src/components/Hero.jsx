import { styles } from "@/libs/styles";
import { MoveRight } from "lucide-react";
import VisibilityWrapper from "./ui/VisitbiltiyWrapper";

const Hero = () => {
  return (
    <header
      className={`${styles.padding} shopping__hero relative min-h-screen flex flex-col-reverse md:flex-row justify-between items-center`}
    >
      <VisibilityWrapper>
        <article className="grid gap-4 text-center md:text-start z-10 mt-10">
          <h1
            className={`${styles.heroHeadText} font-montserrat text-gray-300`}
          >
            Where Elegance
            <br />
            Meets Convenience.
          </h1>
          <p className={`${styles.heroSubText} font-montserrat text-gray-300`}>
            Shop exclusive collections with premium
            <br />
            quality and seamless shopping.
          </p>
          <div className="flex items-center justify-center md:justify-start md:items-start">
            <button className="glass-card rounded-2xl font-montserrat px-3 py-4 w-[230px] flex items-center justify-between hover:scale-105 active:scale-95">
              SHOP NOW
              <MoveRight />
            </button>
          </div>
        </article>
      </VisibilityWrapper>
    </header>
  );
};

export default Hero;
