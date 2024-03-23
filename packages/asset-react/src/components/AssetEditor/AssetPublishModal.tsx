import { Button, Modal, ModalProps, Select } from "antd";
import { AssetCard } from "../Assset/AssetCard";
import { useAssetEditor } from "./AssetEditorContext";
import { useAssetHub } from "../../context";
import { FeeAssetCollectionInput } from "../AssetCollect";
import { useAssetPublish } from "./useAssetPublish";

export function AssetPublishForm() {
  const { account, ctx, storage, setStorage } = useAssetHub();
  const { metadata, collectModule, setCollectModule, setPublished } =
    useAssetEditor();

  const { publish, loading } = useAssetPublish();

  const storageOptions = Object.values(ctx.storages).map((s) => ({
    label: s.scheme.label,
    value: s.scheme.name,
  }));

  const handlePublish = () => {
    publish().then((assetId) => {
      setPublished(assetId);
    });
  };
  return (
    metadata &&
    account && (
      <div className="flex flex-wrap gap-6 text-base">
        <div className="flex-[3] min-w-[100px] items-center">
          <AssetCard
            name={metadata.name}
            publisher={account}
            image={metadata.image}
          />
        </div>
        <div className="flex-[4] items-start flex flex-col">
          <div>
            Storage:
            <Select
              style={{ width: 180, marginLeft: "6px" }}
              value={storage.scheme.name}
              options={storageOptions}
              onChange={(v) => {
                setStorage(ctx.storages[v]);
              }}
            />
          </div>
          <div className="w-full mt-2">
            <FeeAssetCollectionInput
              value={collectModule}
              onChange={(v) => {
                setCollectModule(v);
              }}
            />
          </div>
          <div className="flex-1"></div>
          <Button
            loading={loading}
            type="primary"
            className="w-full my-2"
            size="large"
            onClick={handlePublish}
          >
            Publish
          </Button>
        </div>
      </div>
    )
  );
}

export type { ModalProps } from "antd";
export type AssetPublishModalProps = ModalProps & {
  open?: boolean;
  onCancel?: () => void;
};
export function AssetPublishModal(props: AssetPublishModalProps) {
  return (
    <Modal
      destroyOnClose
      centered
      footer={null}
      title="Pulbish Asset"
      width={700}
      transitionName=""
      maskTransitionName=""
      className="h-[max-content]"
      wrapClassName="backdrop-blur-md"
      {...props}
    >
      <AssetPublishForm />
    </Modal>
  );
}
