import React from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode><AuthProvider><AppRoutes/></AuthProvider></React.StrictMode>
);
