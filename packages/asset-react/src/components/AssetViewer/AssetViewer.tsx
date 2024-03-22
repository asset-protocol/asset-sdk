import { useViewer } from "../../hook/core";
import {
  AssetViewerProvider,
  AssetViewerProviderProps,
} from "./AssetViewerContext";
import { useGetAssetById } from "../../client/indexer";
import { useAssetHub } from "../../context";

export type AssetViewerProps = Omit<
  AssetViewerProviderProps,
  "asset" | "children"
> & {
  assetId: bigint;
  className?: string;
  viewerAttributes?: Record<string, unknown>;
};

export function AssetViewer(props: AssetViewerProps) {
  const { assetId, viewerAttributes, ...resProps } = props;
  const getViewer = useViewer();
  const { hubInfo } = useAssetHub();
  const { asset, refetch } = useGetAssetById(assetId, hubInfo?.id ?? "");

  const ViewerSelector = asset && getViewer(asset).viewer;
  return (
    <>
      {asset ? (
        <AssetViewerProvider {...resProps} asset={asset} onRefresh={refetch}>
          {ViewerSelector && (
            <ViewerSelector {...viewerAttributes} value={asset} />
          )}
        </AssetViewerProvider>
      ) : null}
    </>
  );
}
