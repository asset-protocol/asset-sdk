import { useViewer } from "../../hook/core";
import {
  AssetViewerProvider,
  AssetViewerProviderProps,
} from "./AssetViewerContext";
import { useGetAssetById } from "../../client/indexer";

export type AssetViewerProps = Omit<
  AssetViewerProviderProps,
  "asset" | "children"
> & {
  hub: string;
  assetId: bigint;
  className?: string;
  viewerAttributes?: Record<string, unknown>;
};

export function AssetViewer(props: AssetViewerProps) {
  const { assetId, viewerAttributes, hub, ...resProps } = props;
  const getViewer = useViewer();
  const { asset, refetch } = useGetAssetById(assetId, hub);

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
