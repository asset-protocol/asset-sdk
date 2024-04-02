import { useBlobRequest } from "../../lib/request";
import { useReplaceUri } from "../../lib/utils";
import { Upload } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

export type VideoBlobUploadProps = {
  value?: string;
  onChange?: (v: string | undefined) => void;
  accept?: string;
  children?: React.ReactNode;
};

export function VideoBlobUpload(props: VideoBlobUploadProps) {
  const replaceUri = useReplaceUri();
  const [file, setFile] = useState<string | undefined>(replaceUri(props.value));
  const blobRequest = useBlobRequest();
  function handleOnChange(info: UploadChangeParam): void {
    if (info.file.status === "done") {
      setFile(info.file.response);
    }
  }
  useEffect(() => {
    props.onChange?.(file);
  }, [file]);
  return (
    <div className="w-full">
      <Upload.Dragger
        accept={props.accept}
        showUploadList={false}
        customRequest={blobRequest}
        onChange={handleOnChange}
        maxCount={1}
      >
        {props.children ? props.children :
          <p className="ant-upload-text">
            Click or drag video file to this area to upload
          </p>}
      </Upload.Dragger>
      <div className="w-full aspect-video rounded-xl overflow-hidden mt-4">
        <ReactPlayer
          url={file}
          width={"100%"}
          height={"100%"}
          controls
        ></ReactPlayer>
      </div>
    </div>
  );
}
