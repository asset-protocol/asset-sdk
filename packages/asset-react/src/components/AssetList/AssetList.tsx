import { Asset } from "../..";
import { useGetHubAssets } from "../../client/indexer";
import { useAssetHub } from "../../context";
import { AssetItem } from "./AssetItem";
import List, { ListGridType } from "antd/es/list";

export type AssetListProps = {
  onAssetClick?: (asset: Asset) => void;
  grid?: ListGridType;
  classname?: string;
  itemClassName?: string;
};

export function AssetList(props: AssetListProps) {
  const { hubInfo } = useAssetHub();

  const { data, loading } = useGetHubAssets({
    hub: hubInfo?.id ?? "",
    first: 9999,
    fetchPolicy: "no-cache",
    orderBy: ["timestamp_DESC"],
  });
  return (
    <List
      className={props.classname}
      // pagination={{ position: "bottom", align: "center" }}
      grid={props.grid}
      loading={loading}
      dataSource={data?.assets}
      itemLayout="horizontal"
      rowKey={(item) => item.assetId}
      renderItem={(item) => (
        <List.Item
          colStyle={{ display: "flex", height: "100%" }}
          className="w-full"
        >
          <AssetItem
            value={item}
            key={item.assetId}
            onClick={(a) => props.onAssetClick?.(a)}
          />
        </List.Item>
      )}
    ></List>
  );
}
