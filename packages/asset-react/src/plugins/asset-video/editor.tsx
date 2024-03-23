import { AssetHubConfig } from "../../core/plugin";
import { TYPE_VIDEO } from "./consts";
import { useAssetHub } from "../../context";
import VideoEditor from "./components/VideoEditor";

const videoEditor = (config: AssetHubConfig) => {
  config.registerEditor({
    types: [{ value: TYPE_VIDEO, label: "Video" }],
    selector: (t) => t === TYPE_VIDEO,
    editor: (props) => <VideoEditor {...props} />,
    useBeforePublish: () => {
      const { storage } = useAssetHub();
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
