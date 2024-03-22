import { Asset } from "../../../client/core";
import { AssetViewerWithHeader } from "../../../components";
import { VideoPlayer } from "../../../components/VideoPlayer/VideoPalyer";
import { useReplaceUri } from "../../../lib/utils";

export default function EmbedVideoViewer({
  value,
}: {
  value: Asset;
  classname?: string;
}) {
  const replaceUri = useReplaceUri();
  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="aspect-video rounded-xl overflow-hidden">
        <VideoPlayer
          url={replaceUri(value.normalizedMetadata?.content)}
          controls
        ></VideoPlayer>
      </div>
      <AssetViewerWithHeader showCover={false}></AssetViewerWithHeader>
    </div>
  );
}
