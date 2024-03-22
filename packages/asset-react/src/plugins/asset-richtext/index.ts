import { AssetHubConfig } from "../../core";
import richtextEditor from "./editor";
import richtextViewer from "./viewer";

export * from './consts';

export default function markdownPlugin(config: AssetHubConfig) {
  richtextEditor(config);
  richtextViewer(config);
}