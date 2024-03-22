import { AssetHubConfig } from "../../core";
import embedVideoEditor from "./editor";
import embedVideoViewer from "./viewer";

export * from './consts';

export default function markdownPlugin(config: AssetHubConfig) {
  embedVideoEditor(config);
  embedVideoViewer(config);
}