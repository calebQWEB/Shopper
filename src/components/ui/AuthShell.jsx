import Link from "next/link";

const AuthShell = ({ title, subtitle, children, footer }) => {
  return (
    <section className="container-page grid place-items-center py-10 sm:py-16">
      <div className="w-full max-w-md">
        <div className="card p-6 shadow-sm sm:p-8">
          <Link href="/" className="font-zen-dots text-sm text-headline">
            SHOPPER
          </Link>
          <h1 className="mt-4 text-2xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && (
          <p className="mt-4 text-center text-sm text-slate-600">{footer}</p>
        )}
      </div>
    </section>
  );
};

export const FormAlert = ({ tone = "error", children }) => (
  <p
    role={tone === "error" ? "alert" : "status"}
    className={`mb-4 rounded-lg px-3 py-2 text-sm ${
      tone === "error"
        ? "bg-rose-50 text-rose-700"
        : "bg-emerald-50 text-emerald-700"
    }`}
  >
    {children}
  </p>
);

export default AuthShell;
