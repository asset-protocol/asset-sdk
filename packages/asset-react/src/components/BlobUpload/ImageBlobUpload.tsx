import { useBlobRequest } from "../../lib/request";
import { useReplaceUri } from "../../lib/utils";
import { Button, Image, Upload } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { useState } from "react";

export type ImageBlobUploadProps = {
  value?: string;
  onChange?: (v?: string) => void;
};

export function ImageBlobUpload(props: ImageBlobUploadProps) {
  const replaceUri = useReplaceUri();

  const [file, setFile] = useState<string | undefined>(replaceUri(props.value));
  const blobRequest = useBlobRequest();

  function handleOnChange(info: UploadChangeParam): void {
    if (info.file.status === "done") {
      const url = URL.createObjectURL(info.file.originFileObj as Blob);
      props.onChange?.(url);
      setFile(url);
    }
  }

  return (
    <Upload
      showUploadList={false}
      customRequest={blobRequest}
      onChange={handleOnChange}
      maxCount={1}
    >
      {file ? (
        <Image width={320} height={180} src={file} preview={false} />
      ) : (
        <Button>Upload</Button>
      )}
    </Upload>
  );
}
