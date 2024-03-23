import { DeleteOutlined } from "@ant-design/icons";
import { Button, Input, Upload } from "antd";
import { useBlobRequest } from "../../lib/request";
import { useAssetEditor } from "./AssetEditorContext";
import { useReplaceUri } from "../../lib/utils";

export function AssetEditorHeader(props: { useImage?: boolean }) {
  const blobRequest = useBlobRequest();
  const { metadata, setMetadata } = useAssetEditor();
  const replaceUri = useReplaceUri();

  const resValue = metadata ?? {
    name: "",
    title: "",
    description: "",
    image: undefined,
  };
  const image = replaceUri(resValue.image);
  const useImage = props.useImage !== false;

  return (
    <div>
      {useImage && (
        <div className={`relative w-full ${image ? "aspect-[2/1]" : "h-12"}`}>
          {image && (
            <>
              <img
                src={image}
                alt=""
                className="w-full h-full z-[-1] absolute top-0 object-cover rounded-md overflow-hidden"
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
                onClick={() => setMetadata({ ...resValue, image: undefined })}
              ></Button>
            )}
            <Upload
              showUploadList={false}
              multiple={false}
              customRequest={blobRequest}
              accept="image/*"
              onChange={(f) => {
                setMetadata({ ...resValue, image: f.file.response });
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
      )}
      <div
        className={`${
          image && useImage ? "px-4 " : ""
        }border-gray-300 border-solid border-0${
          image && useImage ? " -translate-y-28" : ""
        }`}
      >
        <Input.TextArea
          placeholder="Input Title"
          variant="borderless"
          autoSize={{ minRows: 1, maxRows: 2 }}
          className="text-3xl font-bold h-24 bg-transparent break-words border-0 focus:border-gray-500 hover:bg-transparent focus:bg-transparent"
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              e.preventDefault();
            }
          }}
          value={resValue.name}
          onChange={(e) => {
            setMetadata({ ...resValue, name: e.target.value });
          }}
        ></Input.TextArea>
      </div>
      <div>
        <div className={`${image && useImage ? "-mt-14" : ""}`}>
          {
            <Input.TextArea
              placeholder="Input Description"
              autoSize
              variant="borderless"
              className="m-auto text-gray-500 my-4 text-base bg-gray-100 rounded-md py-6 px-6 focus:border-gray-500 hover:bg-gray-100 focus:bg-gray-100"
              value={resValue.description}
              onChange={(e) => {
                setMetadata({ ...resValue, description: e.target.value });
              }}
            ></Input.TextArea>
          }
        </div>
      </div>
    </div>
  );
}
