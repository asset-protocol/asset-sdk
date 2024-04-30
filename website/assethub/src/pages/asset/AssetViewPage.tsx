import { AssetViewer, AssetViewerProps } from "@asset-protocol/react";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useNavigateAssetHub } from "../../utils/route";

export function AssetViewPage() {
  const { assetId } = useParams();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const navigate = useNavigateAssetHub();

  const resAssetId = assetId ? BigInt(assetId) : undefined;

  const config: Omit<AssetViewerProps, "assetId"> = {
    account: address,
    requestLogin: openConnectModal,
    onEdit: () => {
      navigate(`/asset/${assetId}/edit`);
    },
  };

  return (
    <div className="flex flex-col m-auto">
      {resAssetId !== undefined ? (
        <div className="max-w-[900px] mt-8 mx-auto">
          <AssetViewer assetId={resAssetId} {...config} />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
