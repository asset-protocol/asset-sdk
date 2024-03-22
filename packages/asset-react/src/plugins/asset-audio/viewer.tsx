import { AssetHubConfig } from "../../core";
import { Asset } from "../../index";
import { Suspense, lazy } from "react";
import { TYPE_AUDIO } from "./consts";

const Viewer = lazy(() => import("./components/AudioViewer"));

const audioViewer = (config: AssetHubConfig) => {
  config.registerViewer(TYPE_AUDIO, {
    selector: (v: Asset) => v.type === TYPE_AUDIO,
    viewer: (props) => (
      <Suspense>
        <Viewer {...props} />
      </Suspense>
    ),
  });
};
export default audioViewer;
