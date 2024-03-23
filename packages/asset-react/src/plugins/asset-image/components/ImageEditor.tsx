import { useBlobRequest } from "../../../lib/request";
import { useReplaceUri } from "../../../lib/utils";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import { UploadChangeParam } from "antd/es/upload/interface";
import { useEffect, useState } from "react";
import { useAssetEditor } from "../../../components/AssetEditor/AssetEditorContext";
import { AssetEditorHeader } from "../../../components";

export type ImageFileInfo = {
  uid: string;
  url: string;
};

export default function ImageEditor() {
  const { content, setContent } = useAssetEditor();
  let images: string[] | string = content ?? [];
  if (typeof content === "string") {
    try {
      images = JSON.parse(content) as string[];
    } catch (e) {
      console.warn(e);
      images = [];
    }
  }
  const fs = (images as string[]).map((f) => ({ uid: f, url: f }));
  const [files, setFiles] = useState(fs);

  const blobRequest = useBlobRequest();
  const replaceUri = useReplaceUri();

  const handleOnChange = (value: UploadChangeParam) => {
    if (files.find((f) => f.uid === value.file.uid)) {
      return;
    }
    const newFile = URL.createObjectURL(value.file.originFileObj as Blob);
    const res = [...files, { uid: value.file.uid, url: newFile }];
    setFiles(res);
  };

  const handleRemoveImage = (f: ImageFileInfo) => {
    setFiles(files.filter((v) => v.uid != f.uid));
  };

  useEffect(() => {
    setContent(JSON.stringify(files.map((f) => f.url)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  return (
    <div>
      <AssetEditorHeader useImage={false} />
      <Upload.Dragger
        multiple
        showUploadList={false}
        onChange={handleOnChange}
        customRequest={blobRequest}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Upload.Dragger>
      {files?.map((f, i) => (
        <div className="relative w-full" key={f.uid + i}>
          <img
            width="100%"
            className="min-h-[100px]"
            title={f.url}
            src={replaceUri(f.url)}
            key={f.uid + i}
          />
          <Button
            className="absolute right-0 top-0"
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveImage(f)}
          ></Button>
        </div>
      ))}
    </div>
  );
}
