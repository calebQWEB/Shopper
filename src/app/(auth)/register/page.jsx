"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AuthShell, { FormAlert } from "@/components/ui/AuthShell";
import PasswordInput from "@/components/ui/PasswordInput";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setServerError(result.error || "Could not create your account.");
        return;
      }
      router.push("/login?registered=1");
    } catch {
      setServerError("Could not reach the server. Please try again.");
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Check out faster and track your orders."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-headline hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {serverError && <FormAlert>{serverError}</FormAlert>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="label">
              Full name
            </label>
            <input
              id="name"
              autoComplete="name"
              placeholder="John Doe"
              className="input"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="label">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+234 456 7890"
              className="input"
              {...register("phone", { required: "Phone number is required" })}
            />
            {errors.phone && <p className="field-error">{errors.phone.message}</p>}
          </div>
        </div>

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
            autoComplete="new-password"
            placeholder="At least 8 characters"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Use at least 8 characters" },
            })}
          />
          {errors.password && (
            <p className="field-error">{errors.password.message}</p>
          )}
        </div>

        <details className="group rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <summary className="cursor-pointer select-none font-medium text-slate-600">
            Have an admin code?
          </summary>
          <div className="pb-1 pt-3">
            <input
              id="adminCode"
              aria-label="Admin code"
              placeholder="Enter admin code"
              className="input"
              {...register("adminCode")}
            />
            <p className="mt-1 text-xs text-slate-500">
              Only needed to register as an admin.
            </p>
          </div>
        </details>

        <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-2 w-full py-3">
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
