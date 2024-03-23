import { Asset } from "../../../client/core";
import { AssetViewerWithHeader } from "../../../components";
import { useReplaceUri } from "../../../lib/utils";
import ReactPlayer from "react-player";

export default function VideoViewer({
  value,
}: {
  value: Asset;
  classname?: string;
}) {
  const replaceUri = useReplaceUri();
  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="w-full aspect-video rounded-xl overflow-hidden">
        <ReactPlayer
          url={replaceUri(value.content)}
          controls
          width={"100%"}
          height={"100%"}
        ></ReactPlayer>
      </div>
      <AssetViewerWithHeader showCover={false}></AssetViewerWithHeader>
    </div>
  );
}
