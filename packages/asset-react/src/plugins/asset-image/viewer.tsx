import { AssetHubConfig } from "../../core";
import { Suspense, lazy } from "react";
import { TYPE_IMAGE } from "./consts";
import { Asset } from "../../client/core";

const ImageViewer = lazy(() => import("./components/ImageViewer"));

const imageViewer = (config: AssetHubConfig) => {
  config.registerViewer(TYPE_IMAGE, {
    selector: (v: Asset) => v.type === TYPE_IMAGE,
    viewer: (props) => (
      <Suspense>
        <ImageViewer {...props} />
      </Suspense>
    ),
  });
};
export default imageViewer;
