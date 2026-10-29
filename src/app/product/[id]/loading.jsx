import { Block, ProductGridSkeleton } from "@/components/ui/Skeletons";

export default function Loading() {
  return (
    <section className="container-page py-6 sm:py-8" aria-busy="true">
      <Block className="h-3 w-48" />
      <div className="mt-4 grid gap-6 md:grid-cols-2 lg:gap-10">
        <Block className="aspect-square rounded-2xl" />
        <div className="grid content-start gap-3">
          <Block className="h-6 w-24 rounded-full" />
          <Block className="h-9 w-4/5" />
          <Block className="h-8 w-32" />
          <Block className="mt-3 h-24" />
          <Block className="mt-3 h-12 w-2/3" />
        </div>
      </div>
      <ProductGridSkeleton count={4} />
    </section>
  );
}
