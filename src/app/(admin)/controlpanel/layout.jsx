import { getServerSession } from "next-auth";
import { styles } from "@/libs/styles";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const layout = ({ children }) => {
  const session = getServerSession(authOptions);

  if (!session.user?.role === "ADMIN") {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold font-montserrat">Access Denied</h1>
      </div>
    );
  }
  return (
    <>
      <div className={`${styles.padding}`}>
        <div className="mt-10">{children}</div>
      </div>
    </>
  );
};

export default layout;
