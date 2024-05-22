import {
  Curation,
  AssetItem,
  Asset,
  useCurationAddAssets,
  AssetApprovalStatus,
  useGetCurationAssetsStatus,
} from "@asset-protocol/react";
import { Badge, Button, List, message } from "antd";
import { AssetSelectorModal } from "../asset/AssetSelector";
import { useState } from "react";
import { useGoAsset } from "../../utils/route";

export type CurationDetailProps = {
  curation: Curation;
};
export function CurationDetail(props: CurationDetailProps) {
  const { goViewer } = useGoAsset();
  const { data } = useGetCurationAssetsStatus(props.curation.id, props.curation.assets.map(a => ({
    hub: a.asset.hub,
    assetId: a.asset.assetId.toString()
  })))

  return (
    <div>
      <h1>{props.curation.name}</h1>

      <p>{props.curation.description}</p>
      <div className="flex items-center gap-2">
        <h2>Assets</h2>
        <div className="flex-1"></div>
        <AddAssetsButton id={BigInt(props.curation.id)} />
        <Button type="primary">Edit</Button>
      </div>
      <List
        dataSource={props.curation.assets}
        grid={{ column: 4, gutter: 12, xs: 2, sm: 3 }}
        itemLayout="horizontal"
        rowKey={(item) => item.asset.assetId}
        renderItem={(item, index) => {
          const assetStatus = data?.[index] ?? item.status;
          return (
            <List.Item
              colStyle={{ display: "flex", height: "100%" }}
              className="w-full"
            >
              <Badge.Ribbon
                rootClassName="w-full h-full"
                text={
                  assetStatus === AssetApprovalStatus.Pending
                    ? "Not Approved"
                    : assetStatus === AssetApprovalStatus.Approved
                      ? "Approved"
                      : assetStatus === AssetApprovalStatus.Expired
                        ? "Expired"
                        : "Rejected"
                }
                color={
                  assetStatus === AssetApprovalStatus.Pending
                    ? "#9c9c9c"
                    : assetStatus === AssetApprovalStatus.Approved
                      ? "green"
                      : assetStatus === AssetApprovalStatus.Expired
                        ? "yellow"
                        : "red"
                }
              >
                <AssetItem
                  value={item.asset}
                  key={item.asset.id}
                  onClick={(a) => goViewer(a.hub, a.assetId.toString())}
                />
              </Badge.Ribbon>
            </List.Item>
          )
        }
        }
      ></List >
    </div >
  );
}

function AddAssetsButton({ id }: { id: bigint }) {
  const { addAssets, loading } = useCurationAddAssets();

  const [visible, setVisible] = useState(false);

  const handleSelect = async (assets: Asset[]) => {
    setVisible(false);
    try {
      await addAssets(
        id,
        assets.map((a) => ({
          hub: a.hub,
          assetId: a.assetId,
          order: 0,
        }))
      );
    } catch (e) {
      message.error("Failed to add assets to curation");
      console.error(e);
    } finally {
      setVisible(false);
    }
  };

  return (
    <Button onClick={() => setVisible(true)}>
      Add Assets
      <AssetSelectorModal
        destroyOnClose
        confirmLoading={loading}
        title="Select Assets"
        open={visible}
        onCancel={() => setVisible(false)}
        maskClosable={false}
        closable={false}
        onFinish={handleSelect}
      />
    </Button>
  );
}
