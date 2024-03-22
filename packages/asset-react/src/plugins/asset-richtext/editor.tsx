import { AssetHubConfig } from "../../core/plugin";
import { lazy, Suspense } from "react";
import { TYPE_RICH_TEXT } from "./consts";

const Editor = lazy(() => import("./components/RichTextEditor"));

const richtextEditor = (config: AssetHubConfig) => {
  config.registerEditor({
    types: [{ value: TYPE_RICH_TEXT, label: "Rich Text" }],
    selector: (t) => t === TYPE_RICH_TEXT,
    editor: (props) => (
      <Suspense>
        <Editor {...props} />
      </Suspense>
    ),
  });
};
export default richtextEditor;
