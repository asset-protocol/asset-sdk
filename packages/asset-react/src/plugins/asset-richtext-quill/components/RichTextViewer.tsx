import {
  AssetViewerHeader,
  useAssetViewer,
} from "../../../components/AssetViewer";
import QuillEditor from "./QuillEditor";

export default function RichTextViewer() {
  const { asset } = useAssetViewer();
  return (
    <div className="max-w-4xl mx-auto border-[1px] border-t-0 border-solid border-gray-300">
      <AssetViewerHeader></AssetViewerHeader>
      <div className="px-4">
        <QuillEditor
          theme="snow"
          value={asset.content}
          readOnly={true}
          modules={{ toolbar: false }}
        />
      </div>
    </div>
  );
}
