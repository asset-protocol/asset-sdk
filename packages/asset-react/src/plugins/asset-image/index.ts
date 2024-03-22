import { AssetHubConfig } from "../../core";
import imageEditor from "./editor";
import imageViewer from "./viewer";

export * from './consts';

export default function imagePlugin(config: AssetHubConfig) {
  imageEditor(config);
  imageViewer(config);
}