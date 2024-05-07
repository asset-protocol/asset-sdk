import { Asset, AssetList } from "@asset-protocol/react";
import { useGoAsset } from "../../utils/route";

export function AssetsPage() {
  const { goViewer } = useGoAsset();
  const hanldeClickAsset = (asset: Asset) => {
    goViewer(asset.hub, asset.assetId.toString());
  };

  return (
    <div className="max-w-[1080px] m-auto">
      <h1 className="text-3xl font-bold mb-4">Assets</h1>
      <AssetList
        grid={{ column: 4, gutter: 12, xs: 2, sm: 3 }}
        onAssetClick={hanldeClickAsset}
        // itemClassName="w-[240px]"
      ></AssetList>
    </div>
  );
}
