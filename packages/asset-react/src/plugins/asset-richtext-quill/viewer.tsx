import { AssetHubConfig } from "../../core";
import { Suspense, lazy } from "react";
import { TYPE_RICH_TEXT } from "./consts";
import { Asset } from "../../client/core";

const Viewer = lazy(() => import("./components/RichTextViewer"));

const richtextViewer = (config: AssetHubConfig) => {
  config.registerViewer(TYPE_RICH_TEXT, {
    selector: (v: Asset) => v.type === TYPE_RICH_TEXT,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    viewer: (props: any) => (
      <Suspense>
        <Viewer {...props} />
      </Suspense>
    ),
  });
  config.registerViewer("q-richtext", {
    selector: (v: Asset) => v.type === "q-richtext",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    viewer: (props: any) => (
      <Suspense>
        <Viewer {...props} />
      </Suspense>
    ),
  });
};
export default richtextViewer;
