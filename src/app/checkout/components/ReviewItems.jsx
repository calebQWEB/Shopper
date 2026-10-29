"use client";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  removeItem,
  removeItemFromBuyNow,
  updateItemQuantity,
  updateItemQuantityFromBuyNow,
  userNotBuyingNow,
} from "@/app/slices/productSlice";
import { formatPrice } from "@/libs/format";

const ReviewItems = ({ items, buyNowStatus, onContinue }) => {
  const dispatch = useDispatch();

  const setQuantity = (id, quantity) => {
    const update = buyNowStatus ? updateItemQuantityFromBuyNow : updateItemQuantity;
    dispatch(update({ id, quantity }));
  };

  const remove = (id) => {
    if (buyNowStatus) {
      dispatch(removeItemFromBuyNow(id));
      dispatch(userNotBuyingNow());
    } else {
      dispatch(removeItem(id));
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Review your items</h2>
      <ul className="mt-4 divide-y divide-slate-200">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3 py-3 first:pt-0 sm:gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-50">
              <Image src={item.imageURL} alt={item.name} fill sizes="80px" className="object-cover" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex justify-between gap-3">
                <p className="line-clamp-2 text-sm font-semibold">{item.name}</p>
                <p className="shrink-0 font-bold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
              <p className="text-xs text-slate-500">{formatPrice(item.price)} each</p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center rounded-lg border border-slate-300">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={item.quantity <= 1}
                    onClick={() => setQuantity(item.id, item.quantity - 1)}
                    className="grid h-8 w-8 place-items-center disabled:opacity-40"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(item.id, item.quantity + 1)}
                    className="grid h-8 w-8 place-items-center"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-end">
        <button type="button" onClick={onContinue} className="btn btn-primary px-6 py-3">
          Continue to delivery
        </button>
      </div>
    </div>
  );
};

export default ReviewItems;
