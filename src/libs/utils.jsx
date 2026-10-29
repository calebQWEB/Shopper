"use client";
import { addItem } from "@/app/slices/productSlice";
import { useDispatch } from "react-redux";

export const useUtils = () => {
  const dispatch = useDispatch();

  // product.quantity is the stock level, so the cart quantity is passed separately
  const addItemsToCart = (mainProduct, quantity = 1) => {
    dispatch(
      addItem({
        id: mainProduct.id,
        name: mainProduct.name,
        cateogory: mainProduct.cateogory,
        quantity,
        imageURL: mainProduct.imageURL,
        price: mainProduct.price,
      })
    );
  };

  return { addItemsToCart };
};
