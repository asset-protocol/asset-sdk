import { Asset } from "../../client/core";
import { AssetHubConfig } from "../../core";
import { Suspense, lazy } from "react";
import { TYPE_MARKDOWN } from "./consts";

const Viewer = lazy(() => import("./components/MarkdownViewer"));

const markdownViewer = (config: AssetHubConfig) => {
  config.registerViewer(TYPE_MARKDOWN, {
    selector: (v: Asset) => v.type === TYPE_MARKDOWN,
    viewer: (props) => (
      <Suspense>
        <Viewer {...props} />
      </Suspense>
    ),
  });
};
export default markdownViewer;
