import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { ImageBlobUpload } from "../../components/BlobUpload/ImageBlobUpload";
import { Asset } from "../../client/core";
import {
  UpdateAssetInput,
  useCreateAsset,
  useUpdateAsset,
} from "../../hook/assethub";
import { useAssetTypes, useEditorProvider } from "../../hook/core";
import { FeeAssetCollectionInput } from "../AssetCollect/FeeAssetCollectInput";
import { AssetFieldType, useSaveAssetMetadata } from "./logic";

export type AssetEditorProps = {
  value?: Asset;
  disabled?: boolean;
  editorProps?: { [key: string]: unknown };
  onSubmitted?: (assetId: bigint) => void;
  classname?: string;
};

export function AssetEditor(props: AssetEditorProps) {
  const saveMetadata = useSaveAssetMetadata();
  const selectEditor = useEditorProvider();

  const [submitLoading, setSubmitLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>();

  const getAssetTypes = useAssetTypes();
  const assetTypeOptions = getAssetTypes();
  const initialValues: Partial<AssetFieldType> =
    (props.value && {
      ...props.value.normalizedMetadata,
    }) ??
    {};
  if (props.value?.collectModule) {
    initialValues.collectModule = {
      module: props.value.collectModule,
      data: props.value.collectModuleInitData,
    };
  }
  const { update } = useUpdateAsset();
  const { create } = useCreateAsset();
  const handleSubmit = async (values: AssetFieldType) => {
    try {
      setSubmitLoading(true);
      const preContent = props.value?.normalizedMetadata?.content;
      if (editorRef.current && preContent !== values.content) {
        values.content = await editorRef.current.onSubmit(values.content);
      }
      let updateData: UpdateAssetInput = {};
      const { collectModule, ...metadata } = values;
      if (collectModule) {
        updateData.collectModule = collectModule.module;
        updateData.collectModuleInitData = collectModule.data;
      }

      const input = await saveMetadata(metadata, props.value);
      updateData = { ...updateData, ...input };

      console.log("asset data", updateData);
      let tokenId = props.value?.assetId;
      if (input && props.value) {
        await update(props.value.assetId, updateData);
      } else {
        tokenId = await create(updateData);
      }
      if (props.onSubmitted) {
        props.onSubmitted(tokenId!);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Form
      name="basic"
      initialValues={initialValues}
      onFinish={handleSubmit}
      className={props.classname}
      disabled={props.disabled}
    >
      <Form.Item<AssetFieldType>
        label="Title"
        name="name"
        rules={[{ required: true, message: "Please input asset title!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<AssetFieldType> label="Description" name="description">
        <Input.TextArea />
      </Form.Item>

      <Form.Item<AssetFieldType> label="CoverImage" name="image">
        <ImageBlobUpload />
      </Form.Item>

      <Form.Item<AssetFieldType>
        label="Type"
        name="type"
        rules={[{ required: true, message: "Please input your description!" }]}
      >
        <Select options={assetTypeOptions}></Select>
      </Form.Item>

      <Form.Item name="collectModule">
        <FeeAssetCollectionInput />
      </Form.Item>

      <Form.Item<AssetFieldType> dependencies={["type"]}>
        {({ getFieldValue }) => {
          const type = getFieldValue("type");
          const p = selectEditor(type);
          const Editor = forwardRef((props, ref) => {
            const onSubmit = p.useOnSubmit?.();
            useImperativeHandle(ref, () => ({
              onSubmit: onSubmit || ((v) => v),
            }));
            return <p.editor {...props} />;
          });
          return (
            <Form.Item label="Content" name="content">
              <Editor ref={editorRef} {...props.editorProps} />
            </Form.Item>
          );
        }}
      </Form.Item>

      <Form.Item>
        <Button loading={submitLoading} htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
