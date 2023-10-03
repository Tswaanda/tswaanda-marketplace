import React, { FC, createContext, useContext, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as adminIdlFactory } from "../../../declarations/tswaanda_backend";
import {
  canisterId,
  idlFactory,
} from "../../../declarations/marketplace_backend";
import { AuthClient } from "@dfinity/auth-client";

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
