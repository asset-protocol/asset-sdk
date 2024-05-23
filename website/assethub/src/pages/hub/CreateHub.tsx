import {
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  useAssetHub,
  useDeployNewAssetHub,
  useHasNamedHub,
} from "@asset-protocol/react";
import { Form, FormInstance, Input, Modal, ModalProps, message } from "antd";
import { ZeroAddress } from "ethers";
import { useEffect, useRef, useState } from "react";

export type HubCreateFormData = {
  name: string;
};
export type CreateHubFormProps = {
  formRef?: React.RefObject<FormInstance<HubCreateFormData>>;
  children?: React.ReactNode;
  onSubmit?: (data: HubCreateFormData) => void;
};

export function CreateHubForm(props: CreateHubFormProps) {
  const { hasNamedHub } = useHasNamedHub();
  return (
    <Form<HubCreateFormData> ref={props.formRef} onFinish={props.onSubmit}>
      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            required: true,
            message: "Please input the name of the curation!",
          },
          {
            message: "Name has already been taken",
            validator: async (_, value) => {
              const exists = await hasNamedHub(value);
              if (exists) {
                throw new Error("Name already exists");
              }
            },
            // validateTrigger: "onSubmit",
          },
        ]}
      >
        <Input placeholder="Please enter the name of the HUB" />
      </Form.Item>
      {props.children}
    </Form>
  );
}

export type CreateHubModalProps = Omit<ModalProps, "onOk"> & {
  onFinish?: (hub: { hub?: string; name: string }) => void;
};

export function CreateHubModal(props: CreateHubModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasCreatorNFT, setHasCreatorNFT] = useState(false);
  const [checkingNFT, setCheckingNFT] = useState(false);

  const formRef = useRef<FormInstance<HubCreateFormData>>(null);
  const { deploy } = useDeployNewAssetHub();
  const { assetHubManager, account } = useAssetHub();

  const hanldeCreate = async (hub: HubCreateFormData) => {
    setIsLoading(true);
    try {
      const hubAdddr = await deploy({
        name: hub.name,
        admin: ZeroAddress,
        createModule: ZeroAddress,
      });
      props.onFinish?.({ hub: hubAdddr, name: hub.name });
    } catch (error) {
      console.error(error);
      message.error("Failed to create hub");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (assetHubManager && account) {
      setCheckingNFT(true);
      assetHubManager
        .canCreateHub(account.address)
        .then((res) => {
          setHasCreatorNFT(res[0]);
          console.log("canCreateHub", res);
        })
        .catch((error) => {
          console.error(error);
          message.error("Failed to check if can create hub");
        })
        .finally(() => {
          setCheckingNFT(false);
        });
    } else {
      setHasCreatorNFT(false);
    }
  }, [assetHubManager, account]);

  return (
    <Modal
      {...props}
      destroyOnClose
      centered
      maskClosable={false}
      onOk={() => formRef.current?.submit()}
      okButtonProps={{
        loading: isLoading,
        disabled: !hasCreatorNFT,
      }}
      confirmLoading={isLoading}
      title="Create Hub"
      transitionName=""
      maskTransitionName=""
    >
      <CreateHubForm formRef={formRef} onSubmit={hanldeCreate}>
        <div className="ml-2">
          {checkingNFT ? (
            <LoadingOutlined />
          ) : hasCreatorNFT ? (
            <CheckCircleTwoTone className="mr-2" twoToneColor="#52c41a" />
          ) : (
            <ExclamationCircleTwoTone className="mr-2" twoToneColor="red" />
          )}
          Require to be an owner of a Creator NFT
        </div>
      </CreateHubForm>
    </Modal>
  );
}
