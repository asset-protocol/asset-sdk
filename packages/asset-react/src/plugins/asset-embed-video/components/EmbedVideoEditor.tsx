import { Input } from "antd";
import { useAssetEditor } from "../../../components/AssetEditor/AssetEditorContext";
import { AssetEditorHeader } from "../../../components";

export default function ExternalLinkEditor() {
  const { content, setContent } = useAssetEditor();
  return (
    <>
      <AssetEditorHeader />
      <Input value={content} onChange={(e) => setContent(e.target.value)} />
    </>
  );
}
