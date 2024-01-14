import { useState, useEffect, lazy, Suspense, CSSProperties } from "react";
import styles from "./style";

// Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navbar, Footer, Loader, LoginModal } from "./components";
import { useSelector, useDispatch } from "react-redux";
import { UserContext } from "./UserContext";
import { setInit } from "./state/globalSlice";
import { initActors } from "./storage-config/functions";

// Pages
const Home = lazy(() => import("./features/Home"));
const Account = lazy(() => import("./features/Account"));
const Company = lazy(() => import("./features/Company"));
const Market = lazy(() => import("./features/Market"));
const NotFound = lazy(() => import("./features/NotFound"));
const Product = lazy(() => import("./features/Product"));
const Services = lazy(() => import("./features/Services"));
const Support = lazy(() => import("./features/Support"));
const VerifyEmail = lazy(() => import("./features/VerifyEmail"));
const Documentation = lazy(() => import("./features/Documentation"));
const HSCodes = lazy(() => import("./components/Documentation/Article"));
const VerifyNewsLetterEmail = lazy(
  () => import("./features/VerifyNewsLetterEmail")
);
const ShoppingCart = lazy(() => import("./features/ShoppingCart"));
const Orders = lazy(() => import("./features/Orders/Orders"));
const Disputes = lazy(() => import("./components/Documentation/Disputes"));
const FAQs = lazy(() => import("./components/FAQs"));
const Notifications = lazy(() => import("./features/Notifications"));
const OrderDetails = lazy(() => import("./features/Orders/OrderDetails"));
import { useAuth } from "./hooks/ContextWrapper";

export const loaderStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  /* Add more loader styles here */
};

const App = () => {
  const containerStyle: CSSProperties = {
    position: "relative",
    minHeight: "100vh", // Ensures the container covers the whole viewport
  };

  const dispatch = useDispatch();

  const init = async () => {
    const res = await initActors();
    if (res) {
      dispatch(setInit());
    }
  };

  useEffect(() => {
    init();
  }, []);

  const { identity } = useAuth();

  console.log("Your principal", identity?.getPrincipal().toString());

  return (
    <main className="font-mont" style={containerStyle}>
      <BrowserRouter>
        <Suspense
          fallback={
            <div style={loaderStyle}>
              <Loader />
            </div>
          }
        >
          <div className={`${styles.paddingX} ${styles.flexCenter}`}>
            <div className={`${styles.boxWidth}`}>
              <Navbar />
            </div>
          </div>

          <div className={`${styles.paddingX} ${styles.flexStart}`}>
            <div className={`${styles.boxWidth}`}>
              <Routes>
                <Route index element={<Home />} />
                <Route path="*" element={<NotFound />} />
                <Route path="account" element={<Account />} />
                <Route path="services" element={<Services />} />
                <Route path="company" element={<Company />} />
                <Route path="orders" element={<Orders />} />
                <Route path="support" element={<Support />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="shopping-cart" element={<ShoppingCart />} />
                <Route path="orders" element={<Orders />} />
                <Route path="shopping-cart" element={<ShoppingCart />} />
                <Route path="market" element={<Market />} />
                <Route path="product/:id" element={<Product />} />
                <Route path="order/:id" element={<OrderDetails />} />
                <Route
                  path="verify-email/:userid/:uniquestr"
                  element={<VerifyEmail />}
                />
                <Route
                  path="verify-email/:id"
                  element={<VerifyNewsLetterEmail />}
                />
                <Route path="documentation" element={<Documentation />} />
                <Route path="faqs" element={<FAQs />} />
                <Route path="hscodes" element={<HSCodes />} />
                <Route path="disputes" element={<Disputes />} />
              </Routes>
            </div>
          </div>

          <div className={`${styles.paddingX} ${styles.flexCenter}`}>
            <div className={`${styles.boxWidth}`}>
              <Footer />
            </div>
          </div>
        </Suspense>
      </BrowserRouter>
    </main>
  );
};

export default App;
