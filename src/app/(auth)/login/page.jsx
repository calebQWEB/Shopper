"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import AuthShell, { FormAlert } from "@/components/ui/AuthShell";
import PasswordInput from "@/components/ui/PasswordInput";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const infoMessage = searchParams.get("verified")
    ? "Email verified successfully. You can now sign in."
    : searchParams.get("registered")
      ? "Account created. Sign in to continue."
      : "";

  const onSubmit = async (data) => {
    setError("");
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setError(
        result.error === "This account has been suspended"
          ? "This account has been suspended. Please contact support."
          : "Invalid email or password."
      );
      return;
    }
    // Only follow same-site paths, so the link can't redirect to another website
    const callbackUrl = searchParams.get("callbackUrl");
    const safeCallback =
      callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
        ? callbackUrl
        : "/";
    router.push(safeCallback);
    router.refresh();
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your account to continue."
      footer={
        <>
          New to Shopper?{" "}
          <Link href="/register" className="font-semibold text-headline hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {infoMessage && <FormAlert tone="success">{infoMessage}</FormAlert>}
      {error && <FormAlert>{error}</FormAlert>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="john@example.com"
            className="input"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="field-error">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-2 w-full py-3">
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
};

export default Page;
