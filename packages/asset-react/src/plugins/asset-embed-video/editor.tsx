import { AssetHubConfig } from "../../core/plugin";
import { lazy, Suspense } from "react";
import { TYPE_EMBED_VIDEO } from "./consts";

const Editor = lazy(() => import("./components/EmbedVideoEditor"));
const embedVideoEditor = (config: AssetHubConfig) => {
  config.registerEditor({
    types: [{ value: TYPE_EMBED_VIDEO, label: "Embed Video" }], // Add a new type for the link editor},
    selector: (t) => t === TYPE_EMBED_VIDEO,
    editor: (props) => (
      <Suspense>
        <Editor {...props} />
      </Suspense>
    ),
  });
};
export default embedVideoEditor;
