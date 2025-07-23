import { styles } from "@/libs/styles";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

const layout = async ({ children }) => {
  const session = await getServerSession(authOptions);

  // If there is no session, redirect to the login page.
  if (!session.user?.role === "CUSTOMER") {
    redirect("/login");
  }
  return (
    <section>
      <div className="grid items-center justify-start gap-4 sticky top-0 shadow-sm bg-white sm:px-16 px-6 sm:py-4 py-2 z-40">
        <Link href="/" className="hidden lg:block">
          <h1>SHOPPPER</h1>
        </Link>
        <h1 className={`${styles.sectionHeadText} font-montserrat font-bold`}>
          Welcome, {session.user.name}
        </h1>
      </div>

      <div>{children}</div>
    </section>
  );
};

export default layout;
