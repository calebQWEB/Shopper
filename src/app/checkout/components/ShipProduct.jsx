"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { setShippingDetails } from "@/app/slices/productSlice";
import * as yup from "yup";
import { useEffect, useState } from "react";

const shippingSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  street: yup.string().required("Street Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  postalCode: yup
    .string()
    .matches(/^\d{6}$/, "Zip Code must be 6 digits")
    .required("Postal Code is required"),
  country: yup.string().required("Country is required"),
  landmark: yup.string(),
});

const ShipProduct = () => {
  const [user, setUser] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(shippingSchema),
  });

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (!res.ok) {
        console.log(data);
        return;
      }
      setUser(data.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const submit = async (data) => {
    try {
      const res = await fetch("/api/address/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          street: data.street,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          isDefault: data.isDefault,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        console.error(result.message);
      } else {
        console.log("Address added successfully:", result.address);
      }
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  return (
    <div className="grid content-center gap-5 items-center justify-center">
      <h1 className="font-montserrat font-bold text-xl">Ship Product</h1>
      <form
        onSubmit={handleSubmit(submit)}
        className="grid gap-8 items-start justify-start"
      >
        <div className="grid gap-5">
          <h2 className="text-black font-bold text-base lg:text-2xl font-montserrat">
            Personal Details
          </h2>
          <label className="grid md:flex gap-4">
            <div>
              <input
                type="text"
                placeholder="John"
                {...register("firstName")}
                className="w-full max-w-md border-2 border-border bg-white text-gray-900 placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-lg p-3 shadow-sm transition-all duration-300"
              />
              <p className="text-red-600">{errors.firstName?.message}</p>
            </div>

            <div>
              <input
                type="text"
                placeholder="Doe"
                {...register("lastName")}
                className="w-full max-w-md border-2 border-border bg-white text-gray-900 placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-lg p-3 shadow-sm transition-all duration-300"
              />
              <p className="text-red-600">{errors.lastName?.message}</p>
            </div>
          </label>

          <div>
            <input
              type="text"
              placeholder="johndoe@yahoo.com"
              {...register("email")}
              className="w-full max-w-md border-2 border-border bg-white text-gray-900 placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-lg p-3 shadow-sm transition-all duration-300"
            />
            <p className="text-red-600">{errors.email?.message}</p>
          </div>
        </div>

        <div className="grid gap-5">
          <h2 className="text-black font-bold text-base lg:text-2xl font-montserrat">
            Shipping Address
          </h2>

          <label className="grid md:flex gap-4">
            <div>
              <input
                type="text"
                placeholder="Street Address"
                {...register("street")}
                className="w-full max-w-md border-2 border-border bg-white text-gray-900 placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-lg p-3 shadow-sm transition-all duration-300"
              />
              <p className="text-red-600">{errors.street?.message}</p>
            </div>

            <div>
              <input
                type="text"
                placeholder="City"
                {...register("city")}
                className="w-full max-w-md border-2 border-border bg-white text-gray-900 placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-lg p-3 shadow-sm transition-all duration-300"
              />
              <p className="text-red-600">{errors.city?.message}</p>
            </div>
          </label>

          <label className="grid md:flex gap-4">
            <div>
              <input
                type="text"
                placeholder="State"
                {...register("state")}
                className="w-full max-w-md border-2 border-border bg-white text-gray-900 placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-lg p-3 shadow-sm transition-all duration-300"
              />
              <p className="text-red-600">{errors.state?.message}</p>
            </div>

            <div>
              <input
                type="text"
                placeholder="Postal Code"
                {...register("postalCode")}
                className="w-full max-w-md border-2 border-border bg-white text-gray-900 placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-lg p-3 shadow-sm transition-all duration-300"
              />
              <p className="text-red-600">{errors.postalCode?.message}</p>
            </div>
          </label>

          <label className="grid md:flex gap-4">
            <div>
              <input
                type="text"
                placeholder="Country"
                {...register("country")}
                className="w-full max-w-md border-2 border-border bg-white text-gray-900 placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-lg p-3 shadow-sm transition-all duration-300"
              />
              <p className="text-red-600">{errors.country?.message}</p>
            </div>

            <div>
              <input
                type="text"
                placeholder="Landmark"
                {...register("landmark")}
                className="w-full max-w-md border-2 border-border bg-white text-gray-900 placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary rounded-lg p-3 shadow-sm transition-all duration-300"
              />
              <p className="text-red-600">{errors.landmark?.message}</p>
            </div>
          </label>

          <div className="flex items-center gap-2 font-montserrat text-lg">
            <input
              type="checkbox"
              {...register("isDefault")}
              className="w-5 h-5 accent-primary"
            />
            <span className="text-sm font-bold text-gray-700">Default</span>
          </div>
        </div>

        <button
          type="submit"
          className="p-2 text-heroBackground bg-green-500 font-semibold rounded-lg hover:scale-105 active:scale-95 self-start"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ShipProduct;
