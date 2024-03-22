import { AssetEditor } from "@asset-protocol/react";
import { useNavigateAssetHub } from "../../utils/route";

export function AssetCreatePage() {
  const navigate = useNavigateAssetHub();

  const handleSubmitted = (assetId: bigint) => {
    navigate(`/asset/${assetId}`, { replace: true });
  };
  return (
    <div className="max-w-[1080px] mx-auto">
      <AssetEditor
        editorProps={{ className: "h-[1000px]" }}
        onSubmitted={handleSubmitted}
        ></AssetEditor>
    </div>
  );
}
