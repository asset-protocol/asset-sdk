import { AssetHubConfig } from "../../core/plugin";
import { lazy, Suspense } from "react";
import { TYPE_VIDEO } from "./consts";
import { useAssetHub } from "../../context";

const Editor = lazy(() => import("./components/VideoEditor"));
const videoEditor = (config: AssetHubConfig) => {
  config.registerEditor({
    types: [{ value: TYPE_VIDEO, label: "Video" }],
    selector: (t) => t === TYPE_VIDEO,
    editor: (props) => (
      <Suspense>
        <Editor {...props} />
      </Suspense>
    ),
    useOnSubmit: () => {
      const { storage } = useAssetHub();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return async (cur: string) => {
        if (cur.startsWith("blob:")) {
          const b = await fetch(cur).then((res) => res.blob());
          const url = await storage.upload({
            data: b,
          });
          return url;
        }
        return cur;
      };
    },
  });
};
export default videoEditor;
