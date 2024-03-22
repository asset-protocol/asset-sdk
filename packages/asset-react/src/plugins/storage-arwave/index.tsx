import { AssetHubConfig } from "../../core";
import { ArwaveStorage } from "./arwave";

export default function arwaveStoragePlugin(config: AssetHubConfig) {
  config.registerStorage(new ArwaveStorage());
}
