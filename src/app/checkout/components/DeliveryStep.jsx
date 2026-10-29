"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setShippingDetails } from "@/app/slices/productSlice";

const NEW_ADDRESS = "new";

const requiredForNew = (message) =>
  yup.string().when("addressId", {
    is: NEW_ADDRESS,
    then: (schema) => schema.trim().required(message),
  });

const deliverySchema = yup.object({
  fullName: yup.string().trim().required("Full name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  phone: yup.string().trim().required("Phone number is required"),
  addressId: yup.string().required("Choose a delivery address"),
  street: requiredForNew("Street address is required"),
  city: requiredForNew("City is required"),
  state: requiredForNew("State is required"),
  postalCode: yup.string().when("addressId", {
    is: NEW_ADDRESS,
    then: (schema) =>
      schema
        .required("Postal code is required")
        .matches(/^\d{6}$/, "Postal code must be 6 digits"),
  }),
  country: requiredForNew("Country is required"),
  landmark: yup.string(),
  saveAddress: yup.boolean(),
});

export const formatAddress = (address) =>
  [address.street, address.city, address.state, address.country]
    .filter(Boolean)
    .join(", ");

const Field = ({ label, error, className = "", children }) => (
  <div className={className}>
    <label className="label">{label}</label>
    {children}
    {error && <p className="field-error">{error.message}</p>}
  </div>
);

const DeliveryStep = ({ user, savedAddresses, onBack, onContinue }) => {
  const dispatch = useDispatch();
  const previous = useSelector((state) => state.product.shippingDetails) || {};
  const [saveError, setSaveError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(deliverySchema),
    defaultValues: {
      fullName: previous.fullName || user.name,
      email: previous.email || user.email,
      phone: previous.phone || user.phoneNumber,
      addressId: savedAddresses[0]?.id ?? NEW_ADDRESS,
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Nigeria",
      landmark: "",
      saveAddress: true,
    },
  });

  const addressId = watch("addressId");

  const submit = async (data) => {
    setSaveError("");
    let address;

    if (data.addressId === NEW_ADDRESS) {
      address = {
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        landmark: data.landmark,
      };

      if (data.saveAddress) {
        try {
          const res = await fetch("/api/address/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...address, isDefault: savedAddresses.length === 0 }),
          });
          if (!res.ok) setSaveError("We couldn't save this address, but you can still continue.");
        } catch {
          setSaveError("We couldn't save this address, but you can still continue.");
        }
      }
    } else {
      const saved = savedAddresses.find((a) => a.id === data.addressId);
      address = {
        street: saved.street,
        city: saved.city,
        state: saved.state,
        postalCode: saved.postalCode,
        country: saved.country,
        landmark: "",
      };
    }

    dispatch(
      setShippingDetails({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        ...address,
      })
    );
    onContinue();
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <h2 className="text-lg font-semibold">Contact details</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.fullName} className="sm:col-span-2">
          <input className="input" autoComplete="name" {...register("fullName")} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input className="input" type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label="Phone number" error={errors.phone}>
          <input className="input" type="tel" autoComplete="tel" {...register("phone")} />
        </Field>
      </div>

      <h2 className="mt-8 text-lg font-semibold">Delivery address</h2>
      <div className="mt-4 grid gap-2">
        {savedAddresses.map((address) => (
          <label
            key={address.id}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${
              addressId === address.id ? "border-headline bg-slate-50" : "border-slate-200"
            }`}
          >
            <input type="radio" value={address.id} {...register("addressId")} className="mt-0.5 accent-headline" />
            <span className="flex-1">
              {formatAddress(address)}
              <span className="block text-xs text-slate-500">{address.postalCode}</span>
            </span>
            {address.isDefault && (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold">Default</span>
            )}
          </label>
        ))}

        <label
          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm font-medium transition ${
            addressId === NEW_ADDRESS ? "border-headline bg-slate-50" : "border-slate-200"
          }`}
        >
          <input type="radio" value={NEW_ADDRESS} {...register("addressId")} className="accent-headline" />
          {savedAddresses.length ? "Use a new address" : "Add your address"}
        </label>
      </div>

      {addressId === NEW_ADDRESS && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Street address" error={errors.street} className="sm:col-span-2">
            <input className="input" autoComplete="street-address" {...register("street")} />
          </Field>
          <Field label="City" error={errors.city}>
            <input className="input" autoComplete="address-level2" {...register("city")} />
          </Field>
          <Field label="State" error={errors.state}>
            <input className="input" autoComplete="address-level1" {...register("state")} />
          </Field>
          <Field label="Postal code" error={errors.postalCode}>
            <input className="input" inputMode="numeric" autoComplete="postal-code" {...register("postalCode")} />
          </Field>
          <Field label="Country" error={errors.country}>
            <input className="input" autoComplete="country-name" {...register("country")} />
          </Field>
          <Field label="Landmark (optional)" error={errors.landmark} className="sm:col-span-2">
            <input className="input" placeholder="e.g. Opposite the city mall" {...register("landmark")} />
          </Field>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" {...register("saveAddress")} className="h-4 w-4 accent-headline" />
            Save this address to my account
          </label>
        </div>
      )}

      {saveError && <p className="mt-4 text-sm text-amber-700">{saveError}</p>}

      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="btn btn-ghost">
          Back
        </button>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary px-6 py-3">
          {isSubmitting ? "Saving…" : "Continue to payment"}
        </button>
      </div>
    </form>
  );
};

export default DeliveryStep;
