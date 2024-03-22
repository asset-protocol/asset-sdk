import { AssetHubConfig } from "../../core";
import { PinataStorage } from "./pinata";

export { STORAGE_SCHEMA_IPFS } from './pinata';

export default function ipfsPinataPlugin(options: { jwtToken: string, gateway: string }) {
  return (config: AssetHubConfig) => {
    config.registerStorage(new PinataStorage(options.jwtToken, options.gateway));
  }
}