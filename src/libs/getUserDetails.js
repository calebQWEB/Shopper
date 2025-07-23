import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
export const getUserDetails = async () => {
  try {
    const session = await getServerSession(authOptions);

    return session?.user || null;
  } catch (error) {
    console.error("Error fetching user session:", error);
    return null;
  }
};
