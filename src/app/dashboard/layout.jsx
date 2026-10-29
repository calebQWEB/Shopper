import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const layout = async ({ children }) => {
  const session = await getServerSession(authOptions);

  // If there is no session, redirect to the login page.
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return children;
};

export default layout;
