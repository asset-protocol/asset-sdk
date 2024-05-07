import { FormInstance, Modal, ModalProps, message } from "antd";
import { CurationCreateForm, CurationFormData } from "./CurationCreateForm";
import { useRef, useState } from "react";
import {
  CurationStatus,
  useAssetHub,
  useCreateCuration,
} from "@asset-protocol/react";

export type CurationCreateModalProps = Pick<ModalProps, "open" | "onCancel"> & {
  onFinish?: (curationId: bigint) => void;
};

export function CurationCreateModal(props: CurationCreateModalProps) {
  const { storage } = useAssetHub();
  const { create } = useCreateCuration();

  const formRef = useRef<FormInstance<CurationFormData>>(null);
  const [createLoading, setCreateLoading] = useState(false);

  const handleSubmit = async (values: CurationFormData) => {
    setCreateLoading(true);
    try {
      let image = values.image;
      if (image && image.startsWith("blob:")) {
        const imageBlob = await fetch(values.image).then((res) => res.blob());
        image = await storage.upload({
          data: imageBlob,
        });
      }
      const content = JSON.stringify({
        name: values.name,
        description: values.description,
        image: image,
      });
      const contentURI = await storage.upload({
        data: content,
      });
      const curationId = await create({
        contentURI,
        status: CurationStatus.Public,
        assets: [],
      });
      console.log("curationId", curationId);
      if (curationId) {
        props.onFinish?.(curationId);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      message.error(e.message);
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <Modal
      {...props}
      destroyOnClose
      centered
      maskClosable={false}
      onOk={() => formRef.current?.submit()}
      confirmLoading={createLoading}
      title="Create Curation"
      transitionName=""
      maskTransitionName=""
    >
      <CurationCreateForm
        formRef={formRef}
        onSubmit={handleSubmit}
      ></CurationCreateForm>
    </Modal>
  );
}
