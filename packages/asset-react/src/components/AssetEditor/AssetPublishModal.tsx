import { Button, Modal, ModalProps } from "antd";
import { AssetCard } from "../Assset/AssetCard";
import { useAssetEditor } from "./AssetEditorContext";
import { useAssetHub } from "../../context";

export function AssetPublishForm() {
  const { account } = useAssetHub();
  const { metadata } = useAssetEditor();

  const handlePublish = () => {};
  return (
    metadata &&
    account && (
      <div className="flex flex-wrap gap-6 text-base items-center">
        <div className="flex-[3] min-w-[100px]">
          <AssetCard
            name={metadata.name}
            publisher={account}
            image={metadata.image}
          />
        </div>
        <div className="flex-[4]">
          <Button
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
