"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import { categories } from "@/libs/constants";
import { FormAlert } from "@/components/ui/AuthShell";

const promotionSchema = yup.object({
  title: yup.string().trim().required("Title is required"),
  description: yup.string().trim().required("Description is required"),
  type: yup.string().oneOf(["percentage", "fixed"]).required(),
  value: yup
    .number()
    .typeError("Enter a number")
    .positive("Must be more than 0")
    .when("type", {
      is: "percentage",
      then: (schema) => schema.max(100, "A percentage can't be more than 100"),
    })
    .required("Value is required"),
  // Kept as YYYY-MM-DD strings (which compare correctly as text) to avoid timezone shifts
  startDate: yup.string().required("Choose a start date"),
  endDate: yup
    .string()
    .required("Choose an end date")
    .test("after-start", "End date must be on or after the start date", function (value) {
      return !value || !this.parent.startDate || value >= this.parent.startDate;
    }),
  status: yup.boolean(),
  applicableTo: yup.string().oneOf(["all", "category", "product"]).required(),
  productIds: yup.array().when("applicableTo", {
    is: "product",
    then: (schema) => schema.min(1, "Choose at least one product"),
  }),
  categoryIds: yup.array().when("applicableTo", {
    is: "category",
    then: (schema) => schema.min(1, "Choose at least one category"),
  }),
  isSpecial: yup.boolean(),
});

const toDateInput = (date) => (date ? new Date(date).toISOString().slice(0, 10) : "");
const splitIds = (value) => (value ? value.split(",").filter(Boolean) : []);

const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: "0.5rem",
    borderColor: state.isFocused ? "#272343" : "#cbd5e1",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(39,35,67,0.15)" : "none",
    minHeight: "42px",
    fontSize: "0.875rem",
  }),
  multiValue: (base) => ({ ...base, backgroundColor: "#e3f6f5", borderRadius: "9999px" }),
  menu: (base) => ({ ...base, fontSize: "0.875rem", zIndex: 30 }),
};

const Field = ({ label, htmlFor, error, hint, className = "", children }) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="label">
      {label}
    </label>
    {children}
    {error ? <p className="field-error">{error.message}</p> : hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
  </div>
);

const PromotionForm = ({ promotion, products }) => {
  const router = useRouter();
  const isEdit = Boolean(promotion);
  const [serverError, setServerError] = useState("");

  const productOptions = products.map((p) => ({ value: String(p.id), label: p.name }));
  const categoryOptions = categories.map((c) => ({ value: c.name, label: c.name }));

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(promotionSchema),
    defaultValues: {
      title: promotion?.title ?? "",
      description: promotion?.description ?? "",
      type: promotion?.type ?? "percentage",
      value: promotion?.value ?? "",
      startDate: toDateInput(promotion?.startDate),
      endDate: toDateInput(promotion?.endDate),
      status: promotion ? promotion.status === "active" : true,
      applicableTo: promotion?.applicableTo ?? "all",
      productIds: splitIds(promotion?.productIds),
      categoryIds: splitIds(promotion?.categoryIds),
      isSpecial: promotion?.isSpecial ?? false,
    },
  });

  const type = watch("type");
  const applicableTo = watch("applicableTo");

  const onSubmit = async (data) => {
    setServerError("");
    const payload = {
      ...data,
      status: data.status ? "active" : "inactive",
      // Stored as comma-separated strings
      productIds: data.applicableTo === "product" ? data.productIds.join(",") : "",
      categoryIds: data.applicableTo === "category" ? data.categoryIds.join(",") : "",
    };

    try {
      const res = await fetch(isEdit ? `/api/promotion/${promotion.id}` : "/api/promotion/create", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        setServerError(result.error || "Could not save the promotion.");
        return;
      }
      router.push(`/controlpanel/promotions?saved=${isEdit ? "updated" : "created"}`);
      router.refresh();
    } catch {
      setServerError("Could not reach the server. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
      {serverError && <FormAlert>{serverError}</FormAlert>}

      <section className="card grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
        <Field label="Title" htmlFor="title" error={errors.title} className="sm:col-span-2" hint="For your reference. Customers see the description.">
          <input id="title" className="input" placeholder="e.g. Black Friday" {...register("title")} />
        </Field>
        <Field label="Banner text" htmlFor="description" error={errors.description} className="sm:col-span-2" hint="Shown to customers in the banner at the top of the store.">
          <input id="description" className="input" placeholder="e.g. Save on all laptops this weekend" {...register("description")} />
        </Field>

        <div>
          <span className="label">Discount type</span>
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
            {[
              ["percentage", "Percentage"],
              ["fixed", "Fixed amount"],
            ].map(([value, label]) => (
              <label
                key={value}
                className={`cursor-pointer rounded-md px-3 py-1.5 text-center text-sm font-semibold transition ${
                  type === value ? "bg-white shadow-sm" : "text-slate-500"
                }`}
              >
                <input type="radio" value={value} className="sr-only" {...register("type")} />
                {label}
              </label>
            ))}
          </div>
        </div>
        <Field label={type === "percentage" ? "Percentage off" : "Amount off (₦)"} htmlFor="value" error={errors.value}>
          <input id="value" type="number" step="0.01" min="0" className="input" {...register("value")} />
        </Field>

        <Field label="Starts" htmlFor="startDate" error={errors.startDate}>
          <input id="startDate" type="date" className="input" {...register("startDate")} />
        </Field>
        <Field label="Ends" htmlFor="endDate" error={errors.endDate}>
          <input id="endDate" type="date" className="input" {...register("endDate")} />
        </Field>

        <Field label="Applies to" htmlFor="applicableTo">
          <select id="applicableTo" className="input" {...register("applicableTo")}>
            <option value="all">All products</option>
            <option value="category">Specific categories</option>
            <option value="product">Specific products</option>
          </select>
        </Field>

        {applicableTo === "product" && (
          <Field label="Products" htmlFor="productIds" error={errors.productIds}>
            <Controller
              control={control}
              name="productIds"
              render={({ field }) => (
                <Select
                  inputId="productIds"
                  instanceId="promotion-products"
                  isMulti
                  options={productOptions}
                  styles={selectStyles}
                  placeholder={products.length ? "Choose products" : "No products yet"}
                  value={productOptions.filter((o) => field.value.includes(o.value))}
                  onChange={(selected) => field.onChange(selected.map((o) => o.value))}
                />
              )}
            />
          </Field>
        )}

        {applicableTo === "category" && (
          <Field label="Categories" htmlFor="categoryIds" error={errors.categoryIds}>
            <Controller
              control={control}
              name="categoryIds"
              render={({ field }) => (
                <Select
                  inputId="categoryIds"
                  instanceId="promotion-categories"
                  isMulti
                  options={categoryOptions}
                  styles={selectStyles}
                  placeholder="Choose categories"
                  value={categoryOptions.filter((o) => field.value.includes(o.value))}
                  onChange={(selected) => field.onChange(selected.map((o) => o.value))}
                />
              )}
            />
          </Field>
        )}

        <div className="grid gap-3 border-t border-slate-200 pt-4 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" className="h-4 w-4 accent-headline" {...register("status")} />
            Turn on (shows in the banner between the start and end dates)
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" className="h-4 w-4 accent-headline" {...register("isSpecial")} />
            Special campaign (kept out of the rotating banner)
          </label>
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <Link href="/controlpanel/promotions" className="btn btn-outline">
          Cancel
        </Link>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary px-6">
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create promotion"}
        </button>
      </div>
    </form>
  );
};

export default PromotionForm;
