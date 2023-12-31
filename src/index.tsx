import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/main.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./state/store";
import ContextWrapper from "./hooks/ContextWrapper";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextWrapper>
        <App />
      </ContextWrapper>
    </Provider>
    <ToastContainer />
  </React.StrictMode>
);