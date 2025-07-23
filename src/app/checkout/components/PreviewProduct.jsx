"use client";
import Image from "next/image";
import { useSelector } from "react-redux";

const PreviewProduct = () => {
  const products = useSelector((state) => state.product.cartItems);
  const buyNowCart = useSelector((state) => state.product.buyNow);
  const buyNowStatus = useSelector((state) => state.product.BuyNowStatus);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center md:text-start">
        Cart Summary
      </h2>

      {!buyNowStatus && (
        <div className="grid gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="grid md:flex items-center justify-center lg:justify-start text-center md:text-start gap-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-md transition-shadow duration-300"
            >
              {/* Product Image */}
              <div className="w-52 h-52 lg:w-24 lg:h-24 relative">
                <Image
                  src={product.imageURL}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                <h3 className="font-semibold text-lg text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600">
                  Quantity:{" "}
                  <span className="font-medium">{product.quantity}</span>
                </p>
                <p className="text-green-600 font-semibold">
                  Total: ${product.price * product.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {buyNowStatus && (
        <div className="grid gap-6">
          {buyNowCart.map((product) => (
            <div
              key={product.id}
              className="grid md:flex items-center justify-center lg:justify-start text-center lg:text-start gap-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-md transition-shadow duration-300"
            >
              {/* Product Image */}
              <div className="w-24 h-24 relative">
                <Image
                  src={product.imageURL}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                <h3 className="font-semibold text-lg text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600">
                  Quantity:{" "}
                  <span className="font-medium">{product.quantity}</span>
                </p>
                <p className="text-green-600 font-semibold">
                  Total: ${product.price * product.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviewProduct;
