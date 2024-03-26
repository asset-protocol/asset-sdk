import { AssetEditor, TYPE_RICH_TEXT } from "@asset-protocol/react";
import { useNavigateAssetHub } from "../../utils/route";

export function AssetCreatePage() {
  const navigate = useNavigateAssetHub();

  const handleSubmitted = (assetId: bigint) => {
    navigate(`/asset/${assetId}`, { replace: true });
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
