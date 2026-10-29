// Small building blocks shared by the control panel pages

export const PageHeader = ({ title, description, children }) => (
  <div className="flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
    {children && <div className="flex flex-wrap gap-2">{children}</div>}
  </div>
);

export const EmptyState = ({ title, description, children }) => (
  <div className="grid place-items-center gap-2 px-6 py-14 text-center">
    <p className="font-semibold">{title}</p>
    {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
    {children && <div className="mt-2">{children}</div>}
  </div>
);

const pillTones = {
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-rose-50 text-rose-700",
  blue: "bg-sky-50 text-sky-700",
  gray: "bg-slate-100 text-slate-600",
};

export const Pill = ({ tone = "gray", children }) => (
  <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${pillTones[tone]}`}>
    {children}
  </span>
);

// A GET form, so filters live in the URL and work without JavaScript
export const FilterBar = ({ children }) => (
  <form method="get" className="mt-6 flex flex-wrap items-end gap-2">
    {children}
    <button type="submit" className="btn btn-primary">
      Apply
    </button>
  </form>
);

export const Table = ({ head, children }) => (
  <div className="card mt-4 overflow-x-auto">
    <table className="w-full min-w-[720px] text-left text-sm">
      <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
        <tr>
          {head.map((heading, i) => (
            <th key={heading || i} scope="col" className="px-4 py-3 font-semibold">
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">{children}</tbody>
    </table>
  </div>
);

export const SavedNotice = ({ children }) => (
  <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
    {children}
  </p>
);
