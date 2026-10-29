import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminShell from "./components/AdminShell";

export const metadata = {
  title: { default: "Control panel", template: "%s | Shopper admin" },
};

export const dynamic = "force-dynamic";

const layout = async ({ children }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/controlpanel");
  }

  if (session.user.role !== "ADMIN") {
    return (
      <div className="container-page grid min-h-[60vh] place-items-center text-center">
        <div>
          <h1 className="text-2xl font-bold">Access denied</h1>
          <p className="mt-2 text-sm text-slate-500">
            The control panel is only available to admins.
          </p>
          <Link href="/" className="btn btn-primary mt-4">
            Back to the store
          </Link>
        </div>
      </div>
    );
  }

  return <AdminShell userName={session.user.name}>{children}</AdminShell>;
};

export default layout;
