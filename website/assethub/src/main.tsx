import React from "react";
import "./index.css";
import "../node_modules/@asset-protocol/react/dist/style.css";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AppProvider } from "./context/app.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <App /> 
    </AppProvider>
  </React.StrictMode>
);
