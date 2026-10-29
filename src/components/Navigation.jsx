import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NavBar from "./NavBar";

// Reads name and role from the session cookie, so the header needs no database query
const Navigation = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user
    ? { name: session.user.name, role: session.user.role }
    : null;

  return <NavBar user={user} />;
};

export default Navigation;
