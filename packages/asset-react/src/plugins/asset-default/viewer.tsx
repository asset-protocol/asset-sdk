import { ASSET_TYPE_UNKNOW, AssetHubConfig } from "../../core";
import { Suspense, lazy } from "react";

const Viewer = lazy(() => import("./components/DefaultViewer"));

const defaultViewer = (config: AssetHubConfig) => {
  config.registerViewer(ASSET_TYPE_UNKNOW, {
    selector: () => true,
    viewer: (props) => (
      <Suspense>
        <Viewer {...props} />
      </Suspense>
    ),
  });
};
export default defaultViewer;
