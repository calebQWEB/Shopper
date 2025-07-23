"use client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthForm from "@/components/ui/AuthForm";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { styles } from "@/libs/styles";

const Page = () => {
  const searchParams = useSearchParams();
  const isVerified = searchParams.get("verified");
  const [infoMessage, setInfoMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isVerified) {
      setInfoMessage("Email verified successfully. You can now login.");
    }
  }, [isVerified]);

  const onSubmit = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (!result.error) {
      router.push("/");
    } else {
      console.log(result.error);
    }
  };
  return (
    <section
      className={`${styles.padding} bg-gradient-to-br from-white to-slate-100 min-h-screen flex flex-col items-center justify-center`}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl ring-1 ring-gray-200">
        {infoMessage && (
          <p className="text-green-600 text-center mb-4 font-medium">
            {infoMessage}
          </p>
        )}

        <h1 className="text-3xl font-bold text-center font-montserrat text-headline mb-6">
          Login
        </h1>

        <AuthForm
          onSubmit={onSubmit}
          submitLabel="Login"
          renderFields={({ register, errors }) => (
            <>
              {/* Email Field */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition duration-150"
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition duration-150"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type="password"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </>
          )}
        />
      </div>

      <div className="mt-4 text-center">
        <p className="text-base text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-amber-900 font-semibold hover:underline text-base"
          >
            Register here
          </a>
        </p>
      </div>
    </section>
  );
};

export default Page;
