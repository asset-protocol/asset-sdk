import { Button, Input, Upload } from "antd";
import { useBlobRequest } from "../../../../../packages/asset-react/src/lib/request";
import { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";

export function DemoPage() {
  const blobRequest = useBlobRequest();
  const [image, setImage] = useState<string>();
  return (
    <div className="max-w-[1080px] mx-auto">
      <div className={`relative w-full ${image ? "aspect-[2/1]" : "h-12"}`}>
        {image && (
          <>
            <img
              src={image}
              alt=""
              className="w-full h-full z-[-1] absolute top-0 object-cover"
            />
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-white from-0% via-[#fffffff0] via-10%  to-transparent backdrop-blur-md"></div>
          </>
        )}
        <div className="absolute top-2 right-2 flex items-center gap-2">
          {image && (
            <Button
              type="text"
              className="text-base aspect-square bg-[#dddddd55] rounded-md py-5 px-4 hover:bg-gray-200 items-center justify-center flex backdrop-blur-md"
              icon={<DeleteOutlined />}
              onClick={() => setImage(undefined)}
            ></Button>
          )}
          <Upload
            showUploadList={false}
            multiple={false}
            customRequest={blobRequest}
            onChange={(f) => {
              setImage(f.file.response);
            }}
          >
            <Button
              type="text"
              className="text-base bg-[#dddddd55] rounded-md py-5 px-4 hover:bg-gray-200 items-center flex backdrop-blur-md"
            >
              <span className="text-gray-800">Choose a over image</span>
            </Button>
          </Upload>
        </div>
      </div>
      <div
        className={`${
          image ? "px-4 " : ""
        }border-gray-300 border-solid border-0${
          image ? " -translate-y-28" : ""
        }`}
      >
        <Input.TextArea
          placeholder="Input Title"
          variant="borderless"
          onKeyDown={(e) => {
            console.log("key", e);
            if (e.code === "Enter") {
              e.code;
              e.preventDefault();
            }
          }}
          autoSize={{ minRows: 1, maxRows: 2 }}
          className="text-3xl font-bold h-24 bg-transparent border-0 focus:border-gray-500 hover:bg-transparent focus:bg-transparent"
        ></Input.TextArea>
      </div>
      <div>
        <div className={`${image ? "-mt-14" : ""}`}>
          {
            <Input.TextArea
              placeholder="Input Description"
              autoSize
              variant="borderless"
              className="m-auto text-gray-500 my-4 text-base bg-gray-100 rounded-md py-6 px-6 focus:border-gray-500 hover:bg-gray-100 focus:bg-gray-100"
            ></Input.TextArea>
          }
        </div>
      </div>
    </div>
  );
}
