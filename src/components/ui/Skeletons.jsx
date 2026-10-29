// Placeholders shown instantly while a page loads its data

export const Block = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="card overflow-hidden">
        <Block className="aspect-square rounded-none" />
        <div className="grid gap-2 p-3 sm:p-4">
          <Block className="h-3 w-1/3" />
          <Block className="h-4 w-4/5" />
          <Block className="h-4 w-1/4" />
          <Block className="mt-2 h-9" />
        </div>
      </div>
    ))}
  </div>
);

export const ListingSkeleton = () => (
  <section className="container-page py-6 sm:py-8" aria-busy="true">
    <Block className="h-3 w-32" />
    <Block className="mt-3 h-8 w-56" />
    <div className="mt-4 flex gap-2 overflow-hidden">
      {Array.from({ length: 6 }, (_, i) => (
        <Block key={i} className="h-8 w-24 shrink-0 rounded-full" />
      ))}
    </div>
    <ProductGridSkeleton />
  </section>
);

export const PageSkeleton = () => (
  <section className="container-page py-6 sm:py-8" aria-busy="true">
    <Block className="h-8 w-48" />
    <Block className="mt-2 h-4 w-72 max-w-full" />
    <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_340px]">
      <Block className="h-72" />
      <Block className="h-48" />
    </div>
  </section>
);
