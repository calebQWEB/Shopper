"use client";
import { useEffect, useState } from "react";
import PayButton from "../SubComponents/PayButton";
import { useSelector } from "react-redux";

const Payment = () => {
  const [userAddress, setUserAddress] = useState([]);
  const cart = useSelector((state) => state.product.cartItems);
  const shipping = useSelector((state) => state.product.shippingDetails);
  const buyNowCart = useSelector((state) => state.product.buyNow);
  const userWantsToBuyNow = useSelector((state) => state.product.BuyNowStatus);
  const userEmail = shipping ? shipping.Email : "";
  // const userEmail = "ochaizydda@gmail.com";
  let newPrice = 0;

  if (userWantsToBuyNow) {
    newPrice = buyNowCart[0].quantity * buyNowCart[0].price * 1000;
  } else {
    if (cart) {
      newPrice = cart.reduce(
        (total, product) => total + product.price * product.quantity * 1000,
        0
      );
    }
  }

  const fetchAddress = async () => {
    try {
      const res = await fetch("/api/address/get");
      const data = await res.json();
      if (!res.ok) {
        console.log(data);
      } else {
        console.log(data);
        setUserAddress(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <div className="grid items-center justify-center gap-8">
      <span className="font-montserrat font-bold text-3xl">
        NGN{newPrice.toLocaleString()}
      </span>
      <PayButton
        email={userEmail}
        amount={newPrice}
        userAddress={userAddress}
      />
    </div>
  );
};

export default Payment;
