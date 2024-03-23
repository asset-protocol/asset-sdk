import { AssetEditorHeader } from "../../../components";
import { useAssetEditor } from "../../../components/AssetEditor/AssetEditorContext";
import { VideoBlobUpload } from "../../../components/BlobUpload/VideoBlobUpload";

export default function VideoEditor() {
  const { content, setContent } = useAssetEditor();
  return (
    <>
      <AssetEditorHeader />
      <VideoBlobUpload
        accept="video/*,.mkv"
        value={content}
        onChange={(v) => setContent(v)}
      ></VideoBlobUpload>
    </>
  );
}
