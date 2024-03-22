import { AssetHubConfig } from "../../core/plugin";
import { useAssetHub } from "../../index";
import { Suspense, lazy } from "react";
import { TYPE_IMAGE } from "./consts";

const Editor = lazy(() => import("./components/ImageEditor"));
export default function imageEditor(config: AssetHubConfig) {
  config.registerEditor({
    types: [{ value: TYPE_IMAGE, label: "Image" }],
    selector: (t) => t === TYPE_IMAGE,
    editor: (props) => (
      <Suspense>
        <Editor {...props} />
      </Suspense>
    ),
    useOnSubmit: () => {
      const { storage } = useAssetHub();
      return async (cur: string) => {
        const files = cur ? JSON.parse(cur) : [];
        const resFiles: string[] = [];
        for (const file of files) {
          if (file.startsWith("blob:")) {
            const b = await fetch(file).then((res) => res.blob());
            const url = await storage.upload({
              data: b,
            });
            resFiles.push(url);
          } else {
            resFiles.push(file);
          }
        }
        const res = JSON.stringify(resFiles);
        return res;
      };
    },
  });
}
