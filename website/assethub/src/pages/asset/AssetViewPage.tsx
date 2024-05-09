import { AssetViewer, AssetViewerProps } from "@asset-protocol/react";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useGoAsset } from "../../utils/route";

export function AssetViewPage() {
  const { hub, assetId } = useParams();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { goEdit } = useGoAsset();

  const resAssetId = assetId ? BigInt(assetId) : undefined;

  const config: Omit<AssetViewerProps, "assetId"> | undefined = hub
    ? {
        hub,
        account: address,
        requestLogin: openConnectModal,
        onEdit: () => {
          if (assetId) {
            goEdit(hub, assetId);
          }
        },
      }
    : undefined;

  return (
    <div className="flex flex-col m-auto">
      {resAssetId !== undefined ? (
        <div className="max-w-[900px] mt-8 mx-auto">
          {config && <AssetViewer assetId={resAssetId} {...config} />}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
