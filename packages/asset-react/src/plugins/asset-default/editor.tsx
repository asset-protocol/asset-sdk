import { ASSET_TYPE_UNKNOW } from "../../core";
import { AssetHubConfig } from "../../core/plugin";
import { lazy, Suspense } from "react";

const Editor = lazy(() => import("./components/DefaultEditor"));

const defaultEditor = (config: AssetHubConfig) => {
  config.registerEditor({
    types: [{ label: ASSET_TYPE_UNKNOW, value: ASSET_TYPE_UNKNOW }],
    selector: () => true,
    editor: (props) => (
      <Suspense>
        <Editor {...props} />
      </Suspense>
    ),
  });
};
export default defaultEditor;
