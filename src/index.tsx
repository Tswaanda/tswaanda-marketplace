import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/main.css";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./state/store";
import { AuthProvider } from "./hooks/ContextWrapper";
import { Notifications } from "react-push-notification";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Notifications />
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
    <ToastContainer />
  </React.StrictMode>
);
