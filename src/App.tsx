import { useState, useEffect, lazy, Suspense, CSSProperties } from "react";
import styles from "./style";

// Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navbar, Footer, Loader, LoginModal } from "./components";
import { useSelector, useDispatch } from "react-redux";
import { UserContext } from "./UserContext";
import { setInit } from "./state/globalSlice";
import { initActors } from "./utils/storage-config/functions";

// Pages
const Home = lazy(() => import("./pages/Home"));
const Account = lazy(() => import("./pages/Account"));
const Company = lazy(() => import("./pages/Company"));
const Market = lazy(() => import("./pages/Market"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Product = lazy(() => import("./pages/Product"));
const Services = lazy(() => import("./pages/Services"));
const Support = lazy(() => import("./pages/Support"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Documentation = lazy(() => import("./pages/Documentation"));
import { useAuth } from "./hooks/ContextWrapper";
import HSCodes from "./components/Documentation/Article";
import Transactions from "./pages/Transactions";
import VerifyNewsLetterEmail from "./pages/VerifyNewsLetterEmail";
import ShoppingCart from "./pages/ShoppingCart";
import Orders from "./pages/Orders";
import KYCModal from "./components/KYCModal";
import Disputes from "./components/Documentation/Disputes";
import FAQs from "./components/FAQs";
import { handleWebSocketMessage } from "./service/main.js";
import Notifications from "./pages/Notifications";

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

  const { checkAuth, identity, ws } = useAuth();

  const dispatch = useDispatch();

  const init = async () => {
    const res = await initActors();
    if (res) {
      dispatch(setInit());
    }
  };

  useEffect(() => {
    init();
    checkAuth();
  }, []);

  console.log(identity?.getPrincipal().toString());

  useEffect(() => {
    if (identity && ws) {
      ws.onmessage = async (event: any) => {
        await handleWebSocketMessage(event);
        const recievedMessage = event.data;
        console.log("Message received from the canister", recievedMessage);
      };
    }
  }, [identity, ws]);

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
          <Routes>
            <Route index element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route
              path="account"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <Account />
                    {/* {showKycModal && <KYCModal show={showKycModal} onClose={() => setShowKycModal(false)} />} */}
                  </div>
                </div>
              }
            />
            <Route
              path="services"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <Services />
                  </div>
                </div>
              }
            />
            <Route
              path="company"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <Company />
                  </div>
                </div>
              }
            />
            <Route
              path="orders"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <Orders />
                  </div>
                </div>
              }
            />

            <Route
              path="support"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <Support />
                  </div>
                </div>
              }
            />

            <Route
              path="notifications"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <Notifications/>
                  </div>
                </div>
              }
            />

            <Route
              path="shopping-cart"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <ShoppingCart />
                  </div>
                </div>
              }
            />

            <Route
              path="orders"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <Orders />
                  </div>
                </div>
              }
            />

            <Route
              path="shopping-cart"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <ShoppingCart />
                  </div>
                </div>
              }
            />

            <Route
              path="market"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <Market />
                  </div>
                </div>
              }
            />
            <Route
              path="product/:id"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <Product />
                  </div>
                </div>
              }
            />
            <Route
              path="verify-email/:userid/:uniquestr"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <VerifyEmail />
                  </div>
                </div>
              }
            />
            <Route
              path="verify-email/:id"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <VerifyNewsLetterEmail />
                  </div>
                </div>
              }
            />
            <Route
              path="documentation"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <Documentation />
                  </div>
                </div>
              }
            />
            <Route
              path="faqs"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <FAQs />
                  </div>
                </div>
              }
            />
            <Route
              path="hscodes"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <HSCodes />
                  </div>
                </div>
              }
            />
            <Route
              path="transactions"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <Transactions />
                  </div>
                </div>
              }
            />
            <Route
              path="disputes"
              element={
                <div className={`${styles.paddingX} ${styles.flexStart}`}>
                  <div className={`${styles.boxWidth}`}>
                    <Disputes />
                  </div>
                </div>
              }
            />
          </Routes>

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
