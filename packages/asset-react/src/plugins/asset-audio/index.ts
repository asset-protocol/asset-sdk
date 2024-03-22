import { AssetHubConfig } from "../../core";
import audioViewer from "./viewer";

export * from './consts';

export default function markdownPlugin(config: AssetHubConfig) {
  audioViewer(config);
}