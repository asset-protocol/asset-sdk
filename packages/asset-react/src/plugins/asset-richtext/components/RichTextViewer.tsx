import { LexicalEditor } from "./lexical";
import {
  AssetViewerWithHeader,
  useAssetViewer,
} from "../../../components/AssetViewer";

export default function RichTextViewer() {
  const { asset } = useAssetViewer();
  return (
    <div className="max-w-[1080px] mx-auto border-[1px] border-t-0 border-solid border-gray-300">
      <AssetViewerWithHeader></AssetViewerWithHeader>
      <div className="px-4">
        <LexicalEditor
          value={asset.normalizedMetadata?.content}
          editable={false}
        />
      </div>
    </div>
  );
}
