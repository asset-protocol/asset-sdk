import { AssetHubConfig } from "../../core";
import markdownEditor from "./editor";
import markdownViewer from "./viewer";

export * from './consts';

export default function markdownPlugin(config: AssetHubConfig) {
  markdownViewer(config);
  markdownEditor(config);
}