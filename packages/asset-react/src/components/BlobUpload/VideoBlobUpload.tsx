import { useBlobRequest } from "../../lib/request";
import { useReplaceUri } from "../../lib/utils";
import { Button, Upload } from "antd";
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
      setFile(URL.createObjectURL(info.file.response as Blob));
    }
  }

  useEffect(() => {
    props.onChange?.(file);
  }, [file, props]);
  return (
    <div className="w-full">
      <Upload
        accept={props.accept}
        showUploadList={false}
        customRequest={blobRequest}
        onChange={handleOnChange}
        maxCount={1}
      >
        {props.children ? props.children : <Button>Upload</Button>}
      </Upload>
      <div className="w-full aspect-video rounded-xl overflow-hidden">
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
