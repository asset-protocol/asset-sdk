import {
  AssetEditor,
  useAssetHub,
  useGetAssetById,
} from "@asset-protocol/react";
import { toBigInt } from "ethers";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { useNavigateAssetHub } from "../../utils/route";

export function AssetEditPage() {
  const { assetId } = useParams();
  const acount = useAccount();
  const { hubInfo } = useAssetHub();
  const { asset } = useGetAssetById(toBigInt(assetId!), hubInfo?.id ?? "");

  const navigate = useNavigateAssetHub();

  const handleSubmitted = (assetId: bigint) => {
    navigate(`/asset/${assetId}`, { replace: true });
  };
  if (!asset) {
    return <div>Loading...</div>;
  }
  return (
    <div className="max-w-[1080px] mx-auto">
      <AssetEditor
        disabled={!acount.address || acount.address !== asset?.publisher}
        value={asset}
        editorProps={{ className: "h-[800px]" }}
        onSubmitted={handleSubmitted}
      ></AssetEditor>
    </div>
  );
}
