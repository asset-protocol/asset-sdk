import { AssetHubConfig, IViewerProvider } from "../../core";
import { Suspense, lazy } from "react";
import { TYPE_VIDEO, TYPE_YOUTUBE } from "./consts";
import { Asset } from "../../client/core";

const Viewer = lazy(() => import("./components/VideoViewer"));

const videoViewer = (config: AssetHubConfig) => {
  const p: IViewerProvider = {
    selector: (v: Asset) => v.type === TYPE_VIDEO || v.type === TYPE_YOUTUBE,
    viewer: (props) => (
      <Suspense>
        <Viewer {...props} />
      </Suspense>
    ),
  };
  config.registerViewer(TYPE_VIDEO, p);
  config.registerViewer(TYPE_YOUTUBE, p);
};
export default videoViewer;
