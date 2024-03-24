import { SerializedRootNode } from "lexical";
import { AssetHubConfig } from "../../core/plugin";
import AssetRichTextEditor from "./components/RichTextEditor";
import { TYPE_RICH_TEXT } from "./consts";
import { SerializedImageNode } from "./components/lexical/nodes/ImageNode";
import { useAssetHub } from "../../context";
import { findTypedChildrenNode } from "./components/utils";

const richtextEditor = (config: AssetHubConfig) => {
  config.registerEditor({
    types: [{ value: TYPE_RICH_TEXT, label: "Rich Text" }],
    selector: (t) => t === TYPE_RICH_TEXT,
    editor: (props) => <AssetRichTextEditor {...props} />,
    useBeforePublish() {
      const { storage } = useAssetHub();
      return async (cur) => {
        const node: { root: SerializedRootNode } = JSON.parse(cur);
        const imageNodes = findTypedChildrenNode<SerializedImageNode>(
          node.root,
          "image"
        );
        for (const imageNode of imageNodes) {
          if (imageNode.src.startsWith("blob:")) {
            imageNode.src = await storage.upload({
              data: await fetch(imageNode.src).then((res) => res.blob()),
            });
          }
        }
        console.log("imageNodes", imageNodes);
        console.log("imageNodes", node);
        return JSON.stringify(node);
      };
    },
  });
};
export default richtextEditor;
