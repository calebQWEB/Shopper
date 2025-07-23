"use client";

import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor, store } from "./store";
import { Provider } from "react-redux";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
