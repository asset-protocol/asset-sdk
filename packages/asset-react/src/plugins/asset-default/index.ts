import { AssetHubConfig } from "../../core";
import defaultEditor from "./editor";
import defaultViewer from "./viewer";

export default function imagePlugin(config: AssetHubConfig) {
  defaultEditor(config);
  defaultViewer(config);
}