import { AssetEditor, useGetAssetById } from "@asset-protocol/react";
import { toBigInt } from "ethers";
import { useParams } from "react-router-dom";
import { useGoAsset } from "../../utils/route";

export function AssetEditPage() {
  const { hub, assetId } = useParams();
  const { asset } = useGetAssetById(toBigInt(assetId!), hub!);

  const { goViewer } = useGoAsset();

  const handleSubmited = (hub: string, assetId: bigint) => {
    goViewer(hub, assetId.toString());
  };

  if (!asset) {
    return <div>Loading...</div>;
  }
  return (
    <div className="max-w-[900px] mx-auto">
      <AssetEditor asset={asset} onPublished={handleSubmited}></AssetEditor>
    </div>
  );
}
