import { Button, Form, Modal, ModalProps } from "antd";
import { AssetCard } from "../Assset/AssetCard";
import { useAssetEditor } from "./AssetEditorContext";
import { useAssetHub } from "../../context";
import {
  PublishFromDataType,
  useAssetPublish,
  usePublishFormValues,
} from "./hook";
import { CollectModuleInput } from "./CollectModuleInput";
import { ZeroAddress } from "ethers";
import { ZERO_BYTES } from "../../core";

export function AssetPublishForm() {
  const { account } = useAssetHub();
  const { metadata, setPublished } = useAssetEditor();

  const { publish, loading } = useAssetPublish();
  const initialValues = usePublishFormValues();

  const handleSubmit = (values: PublishFromDataType) => {
    console.log("values", values);
    if (!values.useCollect) {
      values.collectModule = {
        module: ZeroAddress,
        initData: ZERO_BYTES
      };
    }
    publish(values).then((assetId) => {
      setPublished(assetId);
    });
  };

  return (
    metadata &&
    account && (
      <div className="flex flex-wrap gap-6 text-base">
        <div className="flex-[3] min-w-[100px] items-center">
          <AssetCard name={metadata.name} image={metadata.image} />
        </div>
        <Form<PublishFromDataType>
          className="flex-[4] items-start flex flex-col"
          onFinish={handleSubmit}
          initialValues={initialValues}
        >
          {/* <Form.Item label="Storage" name="storage">
            <Select
              style={{ width: 180, marginLeft: "6px" }}
              options={storageOptions}
            />
          </Form.Item> */}
          <Form.Item noStyle className="w-full mt-2">
            <CollectModuleInput />
          </Form.Item>
          <div className="flex-1"></div>
          <Form.Item>
            <Button
              loading={loading}
              type="primary"
              className="w-full my-2"
              size="large"
              htmlType="submit"
            >
              Publish
            </Button>
          </Form.Item>
        </Form>
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
      maskClosable={false}
      maskTransitionName=""
      className="h-[max-content]"
      wrapClassName="backdrop-blur-md"
      {...props}
    >
      <AssetPublishForm />
    </Modal>
  );
}
