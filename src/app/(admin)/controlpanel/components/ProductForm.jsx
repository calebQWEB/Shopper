"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { categories } from "@/libs/constants";
import { formatNaira, getDiscount, toNaira } from "@/libs/format";
import { FormAlert } from "@/components/ui/AuthShell";
import ImageUpload from "./ImageUpload";
import TagsInput from "./TagsInput";

const toDateInput = (date) => (date ? new Date(date).toISOString().slice(0, 10) : "");

const Section = ({ title, description, children }) => (
  <section className="card p-4 sm:p-6">
    <h2 className="font-semibold">{title}</h2>
    {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
  </section>
);

const Field = ({ label, htmlFor, error, hint, className = "", children }) => (
  <div className={className}>
    <label htmlFor={htmlFor} className="label">
      {label}
    </label>
    {children}
    {error ? <p className="field-error">{error.message}</p> : hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
  </div>
);

const ProductForm = ({ product }) => {
  const router = useRouter();
  const isEdit = Boolean(product);
  const [tags, setTags] = useState(Array.isArray(product?.tags) ? product.tags : []);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: product?.name ?? "",
      cateogory: product?.cateogory ?? "",
      description: product?.description ?? "",
      imageURL: product?.imageURL ?? "",
      price: product?.price ?? "",
      oldPrice: product?.oldPrice ?? "",
      quantity: product?.quantity ?? 0,
      sku: product?.sku ?? "",
      status: product?.status ?? "in_stock",
      restockDate: toDateInput(product?.restockDate),
      weight: product?.weight ?? "",
      length: product?.length ?? "",
      width: product?.width ?? "",
      height: product?.height ?? "",
      visibility: product?.visibility ?? "active",
      isFeatured: product?.isFeatured ?? false,
      title: product?.title ?? "",
      seoDescription: product?.seoDescription ?? "",
      publishedDate: toDateInput(product?.publishedDate),
    },
  });

  const imageURL = watch("imageURL");
  const price = Number(watch("price")) || 0;

  const onSubmit = async (data) => {
    setServerError("");

    // Empty optional fields are left out so they don't overwrite stored values
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== "" && value !== undefined && value !== null)
    );
    payload.tags = tags;
    const discount = getDiscount({ price: Number(data.price), oldPrice: Number(data.oldPrice) });
    if (discount) payload.discount = discount;

    try {
      const res = await fetch(isEdit ? `/api/product/${product.id}` : "/api/product/create", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        setServerError(result.error || "Could not save the product.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      router.push(`/controlpanel/products?saved=${isEdit ? "updated" : "created"}`);
      router.refresh();
    } catch {
      setServerError("Could not reach the server. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
      {serverError && <FormAlert>{serverError}</FormAlert>}

      <Section title="Basics">
        <Field label="Product name" htmlFor="name" error={errors.name} className="sm:col-span-2">
          <input id="name" className="input" placeholder="e.g. MacBook Pro 14" {...register("name", { required: "Name is required" })} />
        </Field>
        <Field label="Category" htmlFor="cateogory" error={errors.cateogory}>
          <select id="cateogory" className="input capitalize" {...register("cateogory", { required: "Choose a category" })}>
            <option value="">Choose a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tags" htmlFor="tags" hint="Press Enter after each tag.">
          <TagsInput id="tags" value={tags} onChange={setTags} />
        </Field>
        <Field label="Description" htmlFor="description" error={errors.description} className="sm:col-span-2">
          <textarea
            id="description"
            rows={5}
            className="input resize-y"
            placeholder="What makes this product great?"
            {...register("description", { required: "Description is required" })}
          />
        </Field>
      </Section>

      <section className="card p-4 sm:p-6">
        <h2 className="font-semibold">Image</h2>
        <p className="mt-1 text-sm text-slate-500">
          {isEdit ? "Upload a new image to replace the current one." : "If you skip this, a placeholder image is used."}
        </p>
        <div className="mt-4">
          <input type="hidden" {...register("imageURL")} />
          <ImageUpload value={imageURL} onChange={(url) => setValue("imageURL", url, { shouldDirty: true })} />
        </div>
      </section>

      <Section title="Pricing" description="Prices are in US dollars and converted to naira at checkout.">
        <Field
          label="Price (USD)"
          htmlFor="price"
          error={errors.price}
          hint={price > 0 ? `Customers pay ${formatNaira(toNaira(price))} at checkout.` : undefined}
        >
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            className="input"
            placeholder="0.00"
            {...register("price", {
              required: "Price is required",
              min: { value: 0.01, message: "Price must be more than 0" },
            })}
          />
        </Field>
        <Field label="Compare-at price (USD)" htmlFor="oldPrice" error={errors.oldPrice} hint="Optional. Shown crossed out to highlight a discount.">
          <input
            id="oldPrice"
            type="number"
            step="0.01"
            min="0"
            className="input"
            placeholder="0.00"
            {...register("oldPrice", {
              validate: (value) =>
                !value || Number(value) > Number(getValues("price")) || "Must be higher than the price",
            })}
          />
        </Field>
      </Section>

      <Section title="Inventory">
        <Field label="Quantity in stock" htmlFor="quantity" error={errors.quantity}>
          <input
            id="quantity"
            type="number"
            min="0"
            step="1"
            className="input"
            {...register("quantity", { min: { value: 0, message: "Can't be negative" } })}
          />
        </Field>
        <Field label="SKU" htmlFor="sku" hint="Optional stock-keeping code. Must be unique.">
          <input id="sku" className="input" placeholder="e.g. MBP-14-SLV" {...register("sku")} />
        </Field>
        <Field label="Stock status" htmlFor="status">
          <select id="status" className="input" {...register("status")}>
            <option value="in_stock">In stock</option>
            <option value="out_of_stock">Out of stock</option>
            <option value="draft">Coming soon</option>
          </select>
        </Field>
        <Field label="Restock date" htmlFor="restockDate" hint="Optional.">
          <input id="restockDate" type="date" className="input" {...register("restockDate")} />
        </Field>
      </Section>

      <Section title="Shipping" description="Optional. Used for packaging and delivery.">
        <Field label="Weight (lbs)" htmlFor="weight">
          <input id="weight" type="number" step="0.01" min="0" className="input" {...register("weight")} />
        </Field>
        <div>
          <span className="label">Dimensions (cm)</span>
          <div className="grid grid-cols-3 gap-2">
            <input type="number" step="0.1" min="0" placeholder="L" aria-label="Length" className="input" {...register("length")} />
            <input type="number" step="0.1" min="0" placeholder="W" aria-label="Width" className="input" {...register("width")} />
            <input type="number" step="0.1" min="0" placeholder="H" aria-label="Height" className="input" {...register("height")} />
          </div>
        </div>
      </Section>

      <Section title="Visibility & SEO">
        <Field label="Visibility" htmlFor="visibility" hint="Only visible products appear in the store.">
          <select id="visibility" className="input" {...register("visibility")}>
            <option value="active">Visible</option>
            <option value="draft">Draft</option>
            <option value="hidden">Hidden</option>
          </select>
        </Field>
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" className="h-4 w-4 accent-headline" {...register("isFeatured")} />
            Feature on the home page
          </label>
        </div>
        <Field label="Page title" htmlFor="title" error={errors.title} hint="Up to 60 characters. Defaults to the product name.">
          <input
            id="title"
            maxLength={60}
            className="input"
            {...register("title", { maxLength: { value: 60, message: "Keep it under 60 characters" } })}
          />
        </Field>
        <Field label="Publish date" htmlFor="publishedDate" hint="Optional.">
          <input id="publishedDate" type="date" className="input" {...register("publishedDate")} />
        </Field>
        <Field label="Search description" htmlFor="seoDescription" error={errors.seoDescription} hint="Up to 160 characters, shown in search results." className="sm:col-span-2">
          <textarea
            id="seoDescription"
            rows={2}
            maxLength={160}
            className="input resize-none"
            {...register("seoDescription", { maxLength: { value: 160, message: "Keep it under 160 characters" } })}
          />
        </Field>
      </Section>

      <div className="sticky bottom-0 -mx-4 flex justify-end gap-2 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <Link href="/controlpanel/products" className="btn btn-outline">
          Cancel
        </Link>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary px-6">
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
