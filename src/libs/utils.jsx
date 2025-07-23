"use client";
import { addItem } from "@/app/slices/productSlice";
import { useDispatch } from "react-redux";

export const useUtils = () => {
  const dispatch = useDispatch();

  const addItemsToCart = (mainProduct) => {
    dispatch(
      addItem({
        id: mainProduct.id,
        name: mainProduct.name,
        cateogory: mainProduct.cateogory,
        quantity: mainProduct.quantity,
        imageURL: mainProduct.imageURL,
        price: mainProduct.price,
      })
    );
  };

  return { addItemsToCart };
};
