"use client";
import Image from "next/image";
import QuantityForm from "../SubComponents/QuantityForm";
import { useSelector } from "react-redux";

const EditProduct = ({ cart, buyNowCart }) => {
  const userBuyNowStatus = useSelector((state) => state.product.BuyNowStatus);
  return (
    <div className="grid gap-2">
      {/* Incase the user wants to purchase everything on his cart at once */}
      {!userBuyNowStatus &&
        Array.isArray(cart) &&
        cart.map((product, index) => (
          <div
            key={product.id || index}
            className="grid text-center md:text-start md:flex justify-center items-center gap-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
          >
            {/* Product Image */}
            {product.imageURL ? (
              <div className="w-52 h-52 lg:w-24 lg:h-24 relative">
                <Image
                  src={product.imageURL}
                  alt={product.name || "Product Image"}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            ) : (
              <p className="text-gray-500">No image available</p>
            )}

            {/* Product Details */}
            <div className="flex-1 grid gap-2">
              <h1 className="font-montserrat font-semibold text-lg text-gray-800">
                {product.name || "Unknown Product"}
              </h1>
              <p className="font-montserrat text-green-600 font-semibold text-lg">
                $ {product.price?.toLocaleString() || "0.00"}
              </p>

              {/* Quantity Form */}
              <div className="flex items-center">
                <QuantityForm
                  productID={product.id}
                  productQuantity={product.quantity}
                />
              </div>
            </div>
          </div>
        ))}

      {/* If the user clicks the BUY NOW button anywhere on the page this shows */}
      {userBuyNowStatus &&
        Array.isArray(buyNowCart) &&
        buyNowCart.map((product) => (
          <div
            key={product.id}
            className="p-5 grid lg:grid-cols-[300px_1fr] items-center gap-6 border border-gray-200 rounded-lg shadow-md bg-white"
          >
            {/* Product Image */}
            {product.imageURL ? (
              <Image
                src={product.imageURL}
                alt={product.name || "Product Image"}
                width={300}
                height={300}
                className="rounded-xl object-cover"
              />
            ) : (
              <p className="text-gray-500">No image available</p>
            )}

            {/* Product Details */}
            <div className="grid gap-4">
              <h1 className="font-montserrat font-extrabold text-2xl md:text-3xl text-gray-800">
                {product.name || "Unknown Product"}
              </h1>
              <p className="font-montserrat text-lg md:text-xl font-semibold text-green-600">
                $ {product.price?.toLocaleString() || "0.00"}
              </p>

              {/* Quantity Form */}
              <div className="flex items-center gap-4">
                <QuantityForm productID={product.id} />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default EditProduct;
