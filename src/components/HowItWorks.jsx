import { styles } from "@/libs/styles";
import How from "./SubComponents/How";

const HowItWorks = () => {
  return (
    <section className={`${styles.padding}`}>
      <h1
        className={`${styles.sectionHeadText} font-montserrat text-headline text-center md:text-start`}
      >
        Simplify the ordering process from
        <br /> discovery to delivery, all in one
        <br /> platform.
      </h1>
      <How />
    </section>
  );
};

export default HowItWorks;
