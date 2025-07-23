"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { styles } from "@/libs/styles";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.log("response", response);
      const result = await response.json();
      setServerError(result.error);
    } else {
      router.push("/login");
    }
  };

  return (
    <section
      className={` ${styles.paddingY} bg-gradient-to-br from-white to-slate-100 min-h-screen flex flex-col items-center justify-center`}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl ring-1 ring-gray-200">
        <h1
          className={`${styles.sectionHeadText} mb-10 text-xl font-montserrat text-headline`}
        >
          Register
        </h1>
        {serverError && <p style={{ color: "red" }}>{serverError}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-4 items-center justify-between">
            <div className="mb-4 grid">
              <label className="block font-monsterrat text-xl font-medium">
                Name
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition duration-150"
                {...register("name", { required: "Name is required" })}
                placeholder="John Doe"
              />
              {errors.name && <p>{errors.name.message}</p>}
            </div>

            {/* Email Input */}
            <div className="mb-4 grid">
              <label className="block font-monsterrat text-xl font-medium">
                Email
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition duration-150"
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="john@example.com"
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>
          </div>

          {/* Phone Number */}
          <div className="mb-4 grid">
            <label className="block font-monsterrat text-xl font-medium">
              Phone Number
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition duration-150"
              {...register("phone", { required: "Phone number is required" })}
              type="tel"
              placeholder="+234 456 7890"
            />
            {errors.phone && <p>{errors.phone.message}</p>}
          </div>

          <div className="mb-4 grid relative">
            <label className="block font-monsterrat text-xl font-medium">
              Password
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition duration-150"
              {...register("password", { required: "Password is required" })}
              type={showPassword ? "text" : "password"}
            />
            {errors.password && <p>{errors.password.message}</p>}

            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>

          <div className="mb-4 grid">
            <label className="block font-monsterrat text-xl font-medium">
              Admin Code (optional)
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition duration-150"
              {...register("adminCode")}
              placeholder="Enter admin code if applicable"
            />
            <small>
              If you have an admin code, enter it here to register as an admin.
            </small>
          </div>

          <button
            type="submit"
            className="w-[200px] border border-solid border-headline bg-primary text-headline text-center self-start font-montserrat font-semibold p-3"
          >
            Register
          </button>
        </form>
      </div>

      <div className="mt-4 text-center">
        <p className="text-base text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-amber-900 font-semibold hover:underline text-base"
          >
            Login here
          </a>
        </p>
      </div>
    </section>
  );
}
