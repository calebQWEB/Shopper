"use client";
import { usePathname } from "next/navigation";

// The control panel has its own header and navigation
const HideOnAdmin = ({ children }) => {
  const pathname = usePathname();
  if (pathname.startsWith("/controlpanel")) return null;
  return children;
};

export default HideOnAdmin;
