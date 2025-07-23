"use client";
import { styles } from "@/libs/styles";
import Link from "next/link";
import Hamburger from "./ui/Hamburger";
import { ChevronDown, CircleUserRound, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

const MobileNav = () => {
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) console.log("Failed to fetch user data");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <nav
      className={`${styles.navPadding} flex items-center justify-between lg:hidden bg-heroBackground z-50`}
    >
      <h1
        onClick={() => {
          console.log(user);
        }}
      >
        SHOPPER
      </h1>

      <ul
        className={`${
          isActive ? "slide-in-left" : "slide-out-left"
        } bg-tertiary p-5 absolute top-full right-0 left-0 grid gap-6`}
      >
        <li className="font-extrabold font-montserrat text-[24px] text-subHeadline flex items-center justify-between">
          All Categories
          <div className="bg-subHeadline P-1 rounded-full grid cursor-pointer">
            <ChevronDown color="#fff" className="self-center" />
          </div>
        </li>
        <li>
          <hr />
        </li>
        <li className="font-extrabold font-montserrat text-[24px] text-subHeadline flex items-center justify-between">
          Trade Assurance
          <div className="bg-subHeadline P-1 rounded-full grid cursor-pointer">
            <ChevronDown color="#fff" className="self-center" />
          </div>
        </li>
        <li>
          <hr />
        </li>
        <li className="font-extrabold font-montserrat text-[24px] text-subHeadline">
          <Link href="/">Help Center</Link>
        </li>
        <li>
          <hr />
        </li>
        <li className="font-extrabold font-montserrat text-[24px] text-subHeadline">
          <Link href="/">Become a supplier</Link>
        </li>
      </ul>
      <div className="flex items-center justify-center gap-3">
        {user && user.success ? (
          <Link href="/dashboard">
            {user?.user?.image ? (
              <img
                src={session.user.image}
                alt="User Avatar"
                width={50}
                height={50}
              />
            ) : (
              <CircleUserRound color="#000000" size={30} />
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
          <ShoppingCart color="#000000" size={30} />
        </Link>
        <Hamburger isActive={isActive} setIsActive={setIsActive} />
      </div>
    </nav>
  );
};

export default MobileNav;
