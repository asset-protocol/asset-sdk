import { useDeployNewAssetHub, useHasNamedHub } from "@asset-protocol/react";
import { Form, FormInstance, Input, Modal, ModalProps, message } from "antd";
import { ZeroAddress } from "ethers";
import { useRef, useState } from "react";

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
        <Input />
      </Form.Item>
      {props.children}
    </Form>
  );
}

export type CreateHubModalProps = Omit<ModalProps, "onOk"> & {
  onFinish?: (hub: { hub: string; name: string }) => void;
};

export function CreateHubModal(props: CreateHubModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<FormInstance<HubCreateFormData>>(null);
  const { deploy } = useDeployNewAssetHub();
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
  return (
    <Modal
      {...props}
      destroyOnClose
      centered
      maskClosable={false}
      onOk={() => formRef.current?.submit()}
      confirmLoading={isLoading}
      title="Create Hub"
      transitionName=""
      maskTransitionName=""
    >
      <CreateHubForm formRef={formRef} onSubmit={hanldeCreate}></CreateHubForm>
    </Modal>
  );
}
