"use client";

import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor, store } from "./store";
import { Provider } from "react-redux";

// Wraps the whole app so the header and toast can read the cart.
export function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

// Holds page content back until the saved cart has been restored.
export function PersistedContent({ children }) {
  return (
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  );
}
