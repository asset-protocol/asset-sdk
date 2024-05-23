import { Asset } from "../..";
import { GetAssetHubAssetsInput, useGetAssets } from "../../client/indexer";
import { AssetItem } from "./AssetItem";
import List, { ListGridType } from "antd/es/list";

export type AssetListProps = {
  query?: GetAssetHubAssetsInput;
  onAssetClick?: (asset: Asset) => void;
  grid?: ListGridType;
  classname?: string;
  itemClassName?: string;
};

export function AssetList(props: AssetListProps) {
  const { data, loading } = useGetAssets(props.query);
  return (
    <List
      className={props.classname}
      // pagination={{ position: "bottom", align: "center" }}
      grid={props.grid}
      loading={loading}
      dataSource={data?.assets}
      itemLayout="horizontal"
      rowKey={(item) => item.id}
      renderItem={(item) => (
        <List.Item
          colStyle={{ display: "flex", height: "100%" }}
          className="w-full"
        >
          <AssetItem
            value={item}
            onClick={(a) => props.onAssetClick?.(a)}
          />
        </List.Item>
      )}
    ></List>
  );
}
