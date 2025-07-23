"use client";
import Navigation from "./Navigation";
import { usePathname } from "next/navigation";

const PathnameProvider = () => {
  const pathname = usePathname();

  const hiddenRoutes = ["/register", "/login", "/dashboard"];

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return <Navigation />;
};

export default PathnameProvider;
