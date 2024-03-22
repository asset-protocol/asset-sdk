import { Asset } from "../../../client/core";
import { AssetViewerWithHeader } from "../../../components";
import { useReplaceUri } from "../../../lib/utils";

export default function ImageViewer({ value }: { value: Asset }) {
  const images = value.normalizedMetadata?.content ?? "[]";
  const files = JSON.parse(images) as string[];

  const replaceUri = useReplaceUri();

  return (
    <div className="max-w-[1080px] mx-auto">
      <AssetViewerWithHeader showCover={false}></AssetViewerWithHeader>
      <div className="text-[0]">
        {files.map((f, i) => (
          <img width="100%" title={f} src={replaceUri(f)} key={f + i} />
        ))}
      </div>
    </div>
  );
}
