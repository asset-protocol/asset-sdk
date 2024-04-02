import { useReplaceUri } from "../../lib/utils";
import { UpCircleFilled, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, message } from "antd";
import { AddressLink } from "../Address/AddressLink";
import { fromNow } from "../../lib/date";
import { CollectButton } from "../AssetCollect";
import {
  useGetAssetCollectors,
  useRefreshAssetMetadata,
} from "../../client/indexer";
import { useAssetHub } from "../../context";
import { useMemo } from "react";
import { useAssetViewer } from "./AssetViewerContext";
import { AssetDescription } from "./AssetDescription";

export function AssetViewerWithHeader(props: {
  showCover?: boolean;
  showDescription?: boolean;
  className?: string;
}) {
  const { asset, account, requestLogin, onEdit } = useAssetViewer();
  const showCover = props.showCover ?? true;
  const showDescription = props.showDescription ?? true;

  const replaceUri = useReplaceUri();
  const { hubInfo } = useAssetHub();
  const { data, refetch: collectorsRefetch } = useGetAssetCollectors(
    hubInfo?.id ?? "",
    asset.assetId.toString(),
    account
  );
  const { refresh: refreshMetadata } =
    useRefreshAssetMetadata();

  const collectCount = useMemo(() => data.collectors.length, [data]);
  const isPublisher = account && account === asset?.publisher;

  const menuProps = {
    items: [
      {
        label: "Refresh Metadata",
        icon: <UpCircleFilled />,
        className: "text-base",
        key: "Refresh",
        onClick: async () => {
          const res = await refreshMetadata(
            asset?.assetId ?? BigInt(0),
            hubInfo?.id ?? ""
          );
          message.success(
            res
              ? "refresh asset metadata success"
              : "refresh asset metadata failed"
          );
        },
        disabled: !isPublisher,
      },
    ],
  };

  return (
    <div className={props.className}>
      {showCover && (
        <div className="relative w-full aspect-[24/9]">
          <img
            src={replaceUri(asset?.image)}
            alt=""
            className="w-full h-full z-[-1] absolute top-0 object-cover rounded-md overflow-hidden"
          />
          <div className=" absolute bottom-0 w-full h-32 bg-gradient-to-t from-white from-0% via-[#fffffff0] via-10%  to-transparent backdrop-blur-md"></div>
        </div>
      )}
      <div
        className={`${showCover ? "px-4 " : ""
          }border-gray-300 border-solid border-0 border-b-[1px]${showCover ? " -translate-y-28" : ""
          }`}
      >
        <h1 className="text-3xl font-bold">{asset.name}</h1>
        <div className="flex items-center flex-wrap  text-base pb-2">
          <div className="flex items-center gap-2">
            <Avatar size={22} icon={<UserOutlined />} />
            <AddressLink address={asset.publisher} />
            <div className="text-gray-500">
              Updated at {fromNow(Number.parseInt((asset.lastUpdatedAt ?? asset.timestamp).toString()))}
            </div>
            {/* AssetId:
                <Button
                  type="link"
                  className="p-0 text-base"
                  title={asset.contentUri}
                >
                  {asset.assetId.toString()}
                </Button> */}
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center">
            <span className="text-gray-500 px-2 text-sm">
              {(asset.collectCount ?? 0) + " Collected"}
            </span>
            <CollectButton
              asset={asset}
              requestLOgin={requestLogin}
              collectedCount={collectCount}
              multiCollect
              onCollected={() => {
                collectorsRefetch();
              }}
            />
            {isPublisher && (
              <div className="ml-2">
                <Dropdown.Button
                  menu={menuProps}
                  onClick={() => onEdit?.(asset)}
                >
                  Edit
                </Dropdown.Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className={`${showCover ? "-mt-24" : ""}`}>
          {showDescription && (
            <div className="m-auto text-gray-500 my-4 text-base bg-gray-100 rounded-md py-6 px-6 mx-4">
              <AssetDescription text={asset?.description} linkSelector={() => ""} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
