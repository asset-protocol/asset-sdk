import { AssetHubConfig } from "../../core/plugin";
import { Suspense, lazy } from "react";
import { TYPE_MARKDOWN } from "./consts";
import { useAssetHub } from "../../context";

const Editor = lazy(() => import("./components/MarkdownEditor"));

const markdownEditor = (config: AssetHubConfig) => {
  config.registerEditor({
    types: [{ value: TYPE_MARKDOWN, label: "Markdown" }],
    selector: (t) => t === TYPE_MARKDOWN,
    editor: (props) => (
      <Suspense>
        <Editor {...props} />
      </Suspense>
    ),
    useOnSubmit: () => {
      const { storage } = useAssetHub();
      return async (cur: string) => {
        let res = cur;
        const linkReg = /(\(blob:http:\/\/localhost:.*\))/g;
        const links = cur.matchAll(linkReg);
        if (links) {
          for (const l of links) {
            try {
              const blobUrl = l[0].replace("(", "").replace(")", "");
              const data = await fetch(blobUrl).then((b) => b.blob());
              const url = await storage.upload({ data });
              res = res.replace(blobUrl, url);
            } catch (e: unknown) {
              console.warn(e);
            }
          }
        }
        console.log("md", res);
        return res;
      };
    },
  });
};
export default markdownEditor;
