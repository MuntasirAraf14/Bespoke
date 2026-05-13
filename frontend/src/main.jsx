import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HashRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <ShopContextProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </GoogleOAuthProvider>
    </ShopContextProvider>
  </HashRouter>,
);
