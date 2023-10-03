import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as adminIdlFactory } from "../../../declarations/tswaanda_backend";
import { canisterId, idlFactory } from "../../../declarations/marketplace_backend";

const host = "https://icp0.io";
const agent = new HttpAgent({ host: host });
const adminCanisterId = "56r5t-tqaaa-aaaal-qb4gq-cai"

export const adminBackendActor = Actor.createActor(adminIdlFactory, {
  agent,
  canisterId: adminCanisterId,
});

export const backendActor = Actor.createActor(idlFactory, {
  agent,
  canisterId: canisterId,
});