import { Button, Form, Modal, ModalProps, Select } from "antd";
import { AssetCard } from "../Assset/AssetCard";
import { useAssetEditor } from "./AssetEditorContext";
import { useAssetHub } from "../../context";
import {
  PublishFromDataType,
  useAssetPublish,
  usePublishFormValues,
} from "./hook";
import { CollectModuleInput } from "./CollectModuleInput";
import { ZeroAddress, formatEther } from "ethers";
import { ZERO_BYTES } from "../../core";
import { useGetHubGlobalModuleConfig } from "../../hook";
import { useGetAssetHubs } from "../../client/indexer";

export function AssetPublishForm() {
  const { account } = useAssetHub();
  const { metadata, setPublished, asset } = useAssetEditor();

  const initialValues = usePublishFormValues();
  const { config: globalTokenConfig } = useGetHubGlobalModuleConfig();
  const { publish, loading, tip } = useAssetPublish();
  const { data } = useGetAssetHubs();

  const handleSubmit = (values: PublishFromDataType) => {
    console.log("values", values);
    if (!values.useCollect) {
      values.collectModule = {
        module: ZeroAddress,
        initData: ZERO_BYTES,
      };
    }
    publish(values, globalTokenConfig).then((assetId) => {
      if (assetId) {
        setPublished(assetId);
      }
    });
  };

  return (
    metadata &&
    account && (
      <div className="flex flex-wrap gap-6 text-base">
        <div className="flex-1 min-w-[100px] items-center">
          <AssetCard name={metadata.name} image={metadata.image} />
        </div>
        <Form<PublishFromDataType>
          className="flex-1 items-start flex flex-col"
          onFinish={handleSubmit}
          initialValues={initialValues}
        >
          <Form.Item label="Sutdio" name="hub">
            <Select
              style={{ width: 180, marginLeft: "6px" }}
              options={data.map((hub) => ({ label: hub.name, value: hub.id }))}
              disabled={!!asset}
            />
          </Form.Item>
          {/* <Form.Item label="Storage" name="storage">
            <Select
              style={{ width: 180, marginLeft: "6px" }}
              options={storageOptions}
            />
          </Form.Item> */}

          <Form.Item noStyle className="w-full my-2">
            <CollectModuleInput />
          </Form.Item>
          <div className="flex-1"></div>
          {globalTokenConfig && !asset && globalTokenConfig.createFee > 0 && (
            <Form.Item noStyle label="Token Fee">
              <div>Token Fee: {formatEther(globalTokenConfig.createFee)}</div>
            </Form.Item>
          )}
          {globalTokenConfig && asset && globalTokenConfig.updateFee > 0 && (
            <Form.Item noStyle label="Token Fee">
              <div>Token Fee: {formatEther(globalTokenConfig.updateFee)}</div>
            </Form.Item>
          )}
          {<span className="text-gray-400">{tip}</span>}
          <Form.Item className="w-full my-2">
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
