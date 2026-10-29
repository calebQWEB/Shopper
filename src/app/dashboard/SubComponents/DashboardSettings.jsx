"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { FormAlert } from "@/components/ui/AuthShell";
import PasswordInput from "@/components/ui/PasswordInput";

const Section = ({ title, description, children, tone }) => (
  <section className={`card p-4 sm:p-6 ${tone === "danger" ? "border-rose-200" : ""}`}>
    <h2 className={`font-semibold ${tone === "danger" ? "text-rose-700" : ""}`}>{title}</h2>
    {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    <div className="mt-4">{children}</div>
  </section>
);

const ProfileForm = ({ user }) => {
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm({
    defaultValues: {
      First_Name: user.name,
      Email: user.email,
      Phone: user.phoneNumber ?? "",
    },
  });

  const submit = async (data) => {
    setMessage(null);
    const response = await fetch("/api/editUser", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      reset(data);
      setMessage({ tone: "success", text: "Your details have been saved." });
      router.refresh();
    } else {
      const result = await response.json().catch(() => ({}));
      setMessage({ tone: "error", text: result.message || "Could not save your details." });
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      {message && <FormAlert tone={message.tone}>{message.text}</FormAlert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="First_Name" className="label">Full name</label>
          <input id="First_Name" className="input" autoComplete="name" {...register("First_Name", { required: "Name is required" })} />
          {errors.First_Name && <p className="field-error">{errors.First_Name.message}</p>}
        </div>
        <div>
          <label htmlFor="Email" className="label">Email</label>
          <input id="Email" type="email" className="input" autoComplete="email" {...register("Email", { required: "Email is required" })} />
          {errors.Email && <p className="field-error">{errors.Email.message}</p>}
        </div>
        <div>
          <label htmlFor="Phone" className="label">Phone number</label>
          <input id="Phone" type="tel" className="input" autoComplete="tel" {...register("Phone", { required: "Phone number is required" })} />
          {errors.Phone && <p className="field-error">{errors.Phone.message}</p>}
        </div>
      </div>
      <button type="submit" disabled={isSubmitting || !isDirty} className="btn btn-primary mt-4">
        {isSubmitting ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
};

const PasswordForm = () => {
  const [message, setMessage] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { Current_Password: "", New_Password: "", Confirm_Password: "" },
  });

  const submit = async (data) => {
    setMessage(null);
    const response = await fetch("/api/changePassword", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      setMessage({
        tone: "error",
        text: result.message === "Invalid Password" ? "Your current password is incorrect." : result.message || "Could not change your password.",
      });
      return;
    }
    reset();
    setMessage({ tone: "success", text: "Your password has been changed." });
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="grid gap-4 sm:max-w-md">
      {message && <FormAlert tone={message.tone}>{message.text}</FormAlert>}
      <div>
        <label htmlFor="Current_Password" className="label">Current password</label>
        <PasswordInput id="Current_Password" autoComplete="current-password" {...register("Current_Password", { required: "Enter your current password" })} />
        {errors.Current_Password && <p className="field-error">{errors.Current_Password.message}</p>}
      </div>
      <div>
        <label htmlFor="New_Password" className="label">New password</label>
        <PasswordInput
          id="New_Password"
          autoComplete="new-password"
          {...register("New_Password", {
            required: "Enter a new password",
            minLength: { value: 8, message: "Use at least 8 characters" },
          })}
        />
        {errors.New_Password && <p className="field-error">{errors.New_Password.message}</p>}
      </div>
      <div>
        <label htmlFor="Confirm_Password" className="label">Confirm new password</label>
        <PasswordInput
          id="Confirm_Password"
          autoComplete="new-password"
          {...register("Confirm_Password", {
            validate: (value) => value === getValues("New_Password") || "Passwords do not match",
          })}
        />
        {errors.Confirm_Password && <p className="field-error">{errors.Confirm_Password.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn btn-primary justify-self-start">
        {isSubmitting ? "Updating…" : "Update password"}
      </button>
    </form>
  );
};

const DeleteAccount = () => {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const deleteUser = async () => {
    setDeleting(true);
    setError("");
    try {
      const response = await fetch("/api/deleteUser", { method: "DELETE" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result.message || "Failed to delete account.");
        return;
      }
      await signOut({ callbackUrl: "/" });
    } catch {
      setError("Unexpected error occurred.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {error && <FormAlert>{error}</FormAlert>}
      {confirming ? (
        <div className="rounded-lg bg-rose-50 p-4">
          <p className="text-sm font-semibold text-rose-800">
            Delete your account permanently? This can&apos;t be undone.
          </p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={deleteUser} disabled={deleting} className="btn bg-rose-600 text-white hover:bg-rose-700">
              {deleting ? "Deleting…" : "Yes, delete my account"}
            </button>
            <button type="button" onClick={() => setConfirming(false)} disabled={deleting} className="btn btn-outline">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="btn border border-rose-300 bg-white text-rose-700 hover:bg-rose-50"
        >
          Delete account
        </button>
      )}
    </>
  );
};

const DashboardSettings = ({ user }) => {
  return (
    <div className="grid gap-4">
      <Section title="Your information" description="Used for your orders and receipts.">
        <ProfileForm user={user} />
      </Section>
      <Section title="Password" description="Choose a strong password you don't use elsewhere.">
        <PasswordForm />
      </Section>
      <Section tone="danger" title="Delete account" description="Permanently remove your account and saved addresses.">
        <DeleteAccount />
      </Section>
    </div>
  );
};

export default DashboardSettings;
