import { AssetEditor, TYPE_RICH_TEXT } from "@asset-protocol/react";
import { useGoAsset } from "../../utils/route";

export function AssetCreatePage() {
  const { goViewer } = useGoAsset();

  const handleSubmitted = (hub: string, assetId: bigint) => {
    goViewer(hub, assetId.toString());
  };
  return (
    <div className="max-w-[1080px] mx-auto">
      <AssetEditor
        onPublished={handleSubmitted}
        defaultType={TYPE_RICH_TEXT}
      ></AssetEditor>
    </div>
  );
}
