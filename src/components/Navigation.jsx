import { styles } from "@/libs/styles";
import Link from "next/link";
import MobileNav from "./MobileNav";
import { CircleUserRound, ShoppingCart } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/libs/prisma";
import Promos from "./Promos";

const Navigation = async () => {
  const session = await getServerSession(authOptions);
  let user = null;

  if (session?.user?.id) {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
  }

  return (
    <>
      <nav className={`${styles.navPadding} nav-card hidden lg:block`}>
        <ul className="flex items-center justify-evenly">
          <li className="font-black font-montserrat text-sm md:text-lg text-black">
            Categories
          </li>
          <li className="font-black font-montserrat text-sm md:text-lg text-black">
            Deals
          </li>
          <li>
            <Link href="/">
              <h1 className="text-2xl font-extrabold text-black">SHOPPER</h1>
            </Link>
          </li>

          {session && user ? (
            <Link
              href={`${
                session.user?.role === "CUSTOMER"
                  ? "/dashboard"
                  : "/controlpanel"
              }`}
            >
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt="User Avatar"
                  width={50}
                  height={50}
                />
              ) : (
                <CircleUserRound color="#000000" size={35} />
              )}
            </Link>
          ) : (
            <Link href="/register">
              <button className="w-full border border-solid border-headline bg-primary text-headline text-center self-start font-montserrat font-semibold p-3">
                Sign up
              </button>
            </Link>
          )}
          <Link href="/cart">
            <ShoppingCart color="#000000" size={35} />
          </Link>
        </ul>
      </nav>
      <MobileNav />
    </>
  );
};

export default Navigation;
