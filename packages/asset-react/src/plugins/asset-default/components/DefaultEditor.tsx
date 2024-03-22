import { Input } from "antd";
import { useAssetEditor } from "../../../components/AssetEditor/AssetEditorContext";
import { AssetEditorHeader } from "../../../components";

export default function ContentEditor() {
  const { content, setContent } = useAssetEditor();
  return (
    <>
      <AssetEditorHeader />
      <Input.TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </>
  );
}
