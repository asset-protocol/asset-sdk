import { AssetHubConfig } from "../../core";
import richtextEditor from "./editor";
import richtextViewer from "./viewer";

export * from './consts';
export * from './editor';

export default function richTextQuillPlugin(config: AssetHubConfig) {
  richtextEditor(config);
  richtextViewer(config);
}