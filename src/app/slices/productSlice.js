// store/checkoutSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  itemAddedToCart: false,
  category: "",
  bulkCategory: "",
  BuyNowStatus: false,
  buyNow: [],
  cartItems: [], // Array of products with id, name, price, imageURL, and quantity
  shippingDetails: {}, // Object to hold shipping address, etc.
  // You could also add payment info here if needed
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    userWantsToBuyNow: (state) => {
      state.BuyNowStatus = true;
    },
    userNotBuyingNow: (state) => {
      state.BuyNowStatus = false;
    },
    // Add a product to the cart (or update quantity if it already exists)
    addItem: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cartItems.push(item);
      }
    },

    addItemToBuyNow: (state, action) => {
      state.buyNow = [action.payload]; // Always replace with the new item
    },

    // Update the quantity of an existing product
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },

    updateItemQuantityFromBuyNow: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.buyNow.find((i) => i.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    // Remove an item from the cart
    removeItem: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
    },

    removeItemFromBuyNow: (state, action) => {
      state.buyNow = state.buyNow.filter((i) => i.id !== action.payload);
    },
    // Save shipping details from the shipping form
    setShippingDetails: (state, action) => {
      state.shippingDetails = action.payload;
    },

    // Item was just added to cart
    itemIsAddedToCart: (state) => {
      state.itemAddedToCart = true;
    },

    // Return the item Added state to false
    itemAddedReturn: (state) => {
      state.itemAddedToCart = false;
    },

    // Reset checkout details (after successful order or cancellation)
    resetCheckout: (state) => {
      state.buyNow = [];
      state.cartItems = [];
      state.shippingDetails = {};
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setBulkCategory: (state, action) => {
      state.bulkCategory = action.payload;
    },
  },
});

export const {
  addItem,
  updateItemQuantity,
  removeItem,
  setShippingDetails,
  resetCheckout,
  userNotBuyingNow,
  userWantsToBuyNow,
  addItemToBuyNow,
  removeItemFromBuyNow,
  updateItemQuantityFromBuyNow,
  itemIsAddedToCart,
  itemAddedReturn,
  setCategory,
  setBulkCategory,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
