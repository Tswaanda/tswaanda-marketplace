import React, { FC, createContext, useContext, useState } from "react";
import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { idlFactory as adminIdlFactory } from "../../../declarations/tswaanda_backend";
import {
  canisterId,
  idlFactory,
} from "../../../declarations/marketplace_backend";
import { AuthClient } from "@dfinity/auth-client";
import fetch from "cross-fetch";

const days = BigInt(1);
const hours = BigInt(24);
const nanoseconds = BigInt(3600000000000);

const authClient = await AuthClient.create({
  idleOptions: {
    idleTimeout: 1000 * 60 * 30,
    disableDefaultIdleCallback: true,
  },
});

const host = "https://icp0.io";
const adminCanisterId = "56r5t-tqaaa-aaaal-qb4gq-cai";

// export const host = "http://localhost:4943";
// export const canisterId = "br5f7-7uaaa-aaaaa-qaaca-cai"

// Types
interface LayoutProps {
  children: React.ReactNode;
}

type Context = {
  principleId: string;
  identity: any;
  backendActor: any;
  adminBackendActor: any;
  isAuthenticated: boolean;
  favouritesUpdated: boolean;
  setContextPrincipleID: (_value: string) => void;
  setUserIdentity: (_value: any) => void;
  setFavouritesUpdated: (_value: boolean) => void;
  login: () => void;
  nfidlogin: () => void;
  logout: () => void;
  checkAuth: () => void;
};

const initialContext: Context = {
  principleId: "",
  identity: null,
  backendActor: null,
  adminBackendActor: null,
  isAuthenticated: false,
  favouritesUpdated: false,
  setContextPrincipleID: (string): void => {
    throw new Error("setContext function must be overridden");
  },
  setFavouritesUpdated: (boolean): void => {
    throw new Error("setContext function must be overridden");
  },
  setUserIdentity: (any): void => {
    throw new Error("setContext function must be overridden");
  },
  login: (): void => {
    throw new Error("login function must be overridden");
  },
  logout: (): void => {
    throw new Error("logout function must be overridden");
  },
  nfidlogin: (): void => {
    throw new Error("nfidLogin function must be overridden");
  },
  checkAuth: (): void => {
    throw new Error("checkAuth function must be overridden");
  },
};

const WalletContext = createContext<Context>(initialContext);

export const useAuth = () => {
  return useContext(WalletContext);
};

const ContextWrapper: FC<LayoutProps> = ({ children }) => {
  const [principleId, setPrincipleId] = useState("");
  const [identity, setIdentity] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favouritesUpdated, setFavouritesUpdated] = useState(false);

  const setContextPrincipleID = (value: string) => {
    setPrincipleId(value);
  };

  const setUserIdentity = (value: any) => {
    setIdentity(value);
  };

  const login = async () => {
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      //   identityProvider:
      //     "http://localhost:4943?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai",
      onSuccess: () => {
        checkAuth();
      },
      maxTimeToLive: days * hours * nanoseconds,
    });
  };

  // //////////////////////////////////////////NFID LOGIN//////////////////////////////////////////////////////////////////////////////////

  const nfidlogin = async () => {
    const authClient = await getAuthClient();
    const isAuthenticated = await authClient.isAuthenticated();
    if (isAuthenticated) {
      checkAuth();
      return;
    }

    await nfidLogin(authClient!);
  };

  const APPLICATION_NAME = "Tswaanda Marketplace";
  const APPLICATION_LOGO_URL =
    "https://dev.nfid.one/static/media/id.300eb72f3335b50f5653a7d6ad5467b3.svg";
  const AUTH_PATH =
    "/authenticate/?applicationName=" +
    APPLICATION_NAME +
    "&applicationLogo=" +
    APPLICATION_LOGO_URL +
    "#authorize";
  const NFID_AUTH_URL = "https://nfid.one" + AUTH_PATH;

  const nfidLogin = async (authClient: AuthClient) => {
    await new Promise((resolve, reject) => {
      authClient.login({
        identityProvider: NFID_AUTH_URL,
        windowOpenerFeatures:
          `left=${window.screen.width / 2 - 525 / 2}, ` +
          `top=${window.screen.height / 2 - 705 / 2},` +
          `toolbar=0,location=0,menubar=0,width=525,height=705`,
        onSuccess: () => {
          const identity = authClient.getIdentity();
          setIsAuthenticated(true);
          setIdentity(identity);
          checkAuth();
        },
        onError: (err) => {
          console.log("error", err);
          reject();
        },
      });
    });

    return authClient.getIdentity();
  };

  const getAuthClient = async () =>
    await AuthClient.create({
      idleOptions: { idleTimeout: 1000 * 60 * 60 * 24 },
    });

  const getAgent = async (identity?: Identity) =>
    new HttpAgent({
      host: "https://ic0.app/",
      fetch,
      identity,
    });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const checkAuth = async () => {
    if (await authClient.isAuthenticated()) {
      setIsAuthenticated(true);
      const identity = authClient.getIdentity();
      setIdentity(identity);
      setContextPrincipleID(identity.getPrincipal().toText());
    }
  };

  const handleLogout = async () => {
    await authClient.logout();
    setIsAuthenticated(false);
    setIdentity(null);
    setContextPrincipleID("");
  };

  const logout = async () => {
    await handleLogout();
    setContextPrincipleID("");
    setIdentity(null);
  };

  let agent = new HttpAgent({
    host: host,
    identity: identity,
  });

  const adminBackendActor = Actor.createActor(adminIdlFactory, {
    agent,
    canisterId: adminCanisterId,
  });

  const backendActor = Actor.createActor(idlFactory, {
    agent,
    canisterId: canisterId,
  });
  return (
    <WalletContext.Provider
      value={{
        principleId,
        setContextPrincipleID,
        setUserIdentity,
        identity,
        backendActor,
        adminBackendActor,
        isAuthenticated,
        favouritesUpdated,
        setFavouritesUpdated,
        nfidlogin,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default ContextWrapper;
