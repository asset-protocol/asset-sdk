import { AssetHubConfig } from "../../core";
import videoEditor from "./editor";
import videoViewer from "./viewer";

export * from './consts';

export default function videoPlugin(config: AssetHubConfig) {
  videoEditor(config);
  videoViewer(config);
}