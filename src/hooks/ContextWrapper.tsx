import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Actor,
  ActorSubclass,
  HttpAgent,
  Identity,
  SignIdentity,
} from "@dfinity/agent";
import {
  idlFactory as adminIdlFactory,
  tswaanda_backend,
} from "../declarations/tswaanda_backend";
import { canisterId as iiCanId } from "../declarations/internet_identity";
import {
  canisterId as marketCanId,
  idlFactory as marketIdlFactory,
} from "../declarations/marketplace_backend";
import {
  AuthClient,
  AuthClientCreateOptions,
  AuthClientLoginOptions,
} from "@dfinity/auth-client";
import {
  _SERVICE,
  AppMessage,
} from "../declarations/tswaanda_backend/tswaanda_backend.did";
import IcWebSocket from "ic-websocket-js";
// @ts-ignore
import icblast from "@infu/icblast";
import { handleWebSocketMessage } from "../service/main.js";
import { set } from "zod";
import { processWsMessage } from "./wsUtils";

const network = process.env.DFX_NETWORK || "local";

const gatewayUrl = "wss://gateway.icws.io";
const icUrl = "https://icp0.io";
const localGatewayUrl = "ws://127.0.0.1:8080";
const localICUrl = "http://127.0.0.1:4943";
const localhost = "http://localhost:3001";
const host = "https://icp0.io";

const adminCanisterId = "56r5t-tqaaa-aaaal-qb4gq-cai";
const adminLocalCanisterId = "bw4dl-smaaa-aaaaa-qaacq-cai";

const authClient = await AuthClient.create({
  idleOptions: {
    idleTimeout: 1000 * 60 * 30,
    disableDefaultIdleCallback: true,
  },
});

// Types
interface LayoutProps {
  children: React.ReactNode;
}

type Context = {
  identity: any;
  backendActor: any;
  adminBackendActor: any;
  isAuthenticated: boolean;
  favouritesUpdated: boolean;
  ws: any;
  wsMessage: AppMessage | null;
  setFavouritesUpdated: (_value: boolean) => void;
  login: () => void;
  nfidlogin: () => void;
  logout: () => void;
};

const initialContext: Context = {
  identity: null,
  backendActor: null,
  adminBackendActor: null,
  isAuthenticated: false,
  favouritesUpdated: false,
  ws: null,
  wsMessage: null,
  setFavouritesUpdated: (boolean): void => {
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
};

const AuthContext = createContext<Context>(initialContext);

interface DefaultOptions {
  createOptions: AuthClientCreateOptions;
  loginOptions: AuthClientLoginOptions;
}

const defaultOptions: DefaultOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider:
      process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app/#authorize"
        : `http://localhost:4943?canisterId=${iiCanId}`,
  },
};

export const useAuthClient = (options = defaultOptions) => {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favouritesUpdated, setFavouritesUpdated] = useState(false);
  const [backendActor, setBackendActor] = useState<ActorSubclass | null>(null);
  const [ws, setWs] = useState<IcWebSocket<_SERVICE, AppMessage> | null>(null);
  const [adminBackendActor, setAdminBackendActor] =
    useState<ActorSubclass | null>(null);
  const [wsMessage, setWsMessage] = useState<AppMessage| null>(null);

  useEffect(() => {
    AuthClient.create(options.createOptions).then(async (client) => {
      checkAuth(client);
    });
  }, []);

  const login = () => {
    authClient?.login({
      ...options.loginOptions,
      onSuccess: () => {
        checkAuth(authClient);
      },
    });
  };

  /************************
   * NFID LOGIN
   **********************/

  const nfidlogin = async () => {
    const authClient = await getAuthClient();
    const isAuthenticated = await authClient.isAuthenticated();
    if (isAuthenticated) {
      checkAuth(authClient);
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
          checkAuth(authClient);
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

  /*****************************************
   * CHECK AUTH AND WEBSOCKETS CONNECTION
   *****************************************/

  const checkAuth = async (client: AuthClient) => {
    const isAuthenticated = await client.isAuthenticated();
    setIsAuthenticated(isAuthenticated);
    const _identity = client.getIdentity();
    setIdentity(_identity);

    let agent = new HttpAgent({
      host: network === "local" ? localhost : host,
      identity: _identity,
    });

    if (network === "local") {
      agent.fetchRootKey();
    }

    const _backendActor = Actor.createActor(marketIdlFactory, {
      agent,
      canisterId: marketCanId,
    });
    setBackendActor(_backendActor);

    let ic = icblast({
      local: network === "local" ? true : false,
      identity: _identity,
    });

    let _adminActor = await ic(
      network === "local" ? adminLocalCanisterId : adminCanisterId
    );
    setAdminBackendActor(_adminActor);

    const _ws = new IcWebSocket(
      network === "local" ? localGatewayUrl : gatewayUrl,
      undefined,
      {
        canisterId:
          network === "local" ? adminLocalCanisterId : adminCanisterId,
        canisterActor: tswaanda_backend,
        identity: _identity as SignIdentity,
        networkUrl: network === "local" ? localICUrl : icUrl,
      }
    );
    setWs(_ws);
  };

  // Websocket connection
  useEffect(() => {
    if (!ws) {
      return;
    }
    ws.onopen = () => {
      console.log("Connected to the canister");
    };
    ws.onclose = () => {
      console.log("Disconnected from the canister");
    };
    ws.onerror = (error: any) => {
      console.log("Error:", error);
    };
    ws.onmessage = async (event: any) => {
      let res = processWsMessage(event.data);
      await handleWebSocketMessage(res);
      const recievedMessage = event.data;
      setWsMessage(recievedMessage);
    };
  }, [ws]);

  const logout = async () => {
    await authClient.logout();
    setIsAuthenticated(false);
    setIdentity(null);
  };
  return {
    identity,
    backendActor,
    adminBackendActor,
    isAuthenticated,
    favouritesUpdated,
    setFavouritesUpdated,
    ws,
    wsMessage,
    nfidlogin,
    login,
    logout,
  };

};

interface LayoutProps {
  children: React.ReactNode;
}

export const AuthProvider: FC<LayoutProps> = ({ children }) => {
  const auth = useAuthClient();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
