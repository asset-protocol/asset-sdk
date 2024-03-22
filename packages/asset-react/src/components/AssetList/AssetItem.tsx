import { useReplaceUri } from "../../lib/utils";
import { Asset } from "../../client/core";
import { Image, Skeleton, Tag } from "antd";
import { PresetColors } from "antd/es/theme/interface";
import clsx from "clsx";
import { fromNow } from "../../lib/date";
export function AssetItem(props: {
  value: Asset;
  onClick?: (asset: Asset) => void;
  classname?: string;
}) {
  const { value } = props;
  const normalizedMetadata = props.value.normalizedMetadata;

  const replaceUri = useReplaceUri();
  const viewAsset = () => {
    props.onClick?.(value);
  };

  return (
    <div
      className={clsx(
        "shadow-md rounded overflow-hidden flex flex-col w-full h-full",
        props.classname
      )}
    >
      {normalizedMetadata && (
        <Image
          title="asset image"
          preview={false}
          className="aspect-video cursor-pointer object-cover w-full"
          src={replaceUri(normalizedMetadata?.image)}
          placeholder={
            <Skeleton.Image
              active
              rootClassName="!w-full !aspect-video"
              className="!w-full !h-full"
            />
          }
          onClick={viewAsset}
        ></Image>
      )}
      {!normalizedMetadata && (
        <div
          className="text-3xl aspect-video flex items-center justify-center bg-gray-200 font-bold"
          onClick={viewAsset}
        >
          No Metadata
        </div>
      )}
      <div className="py-4 px-2 flex-1 flex flex-col gap-2">
        <div className="text-lg font-bold">
          <div className="flex">
            <div
              className="flex-1 cursor-pointer line-clamp-1 hover:underline"
              title={value.name}
              onClick={viewAsset}
            >
              {value.name ?? "---"}
            </div>
            <div>#{value.assetId?.toString()}</div>
          </div>
        </div>
        <div className="line-clamp-1">
          {value.normalizedMetadata?.description}
        </div>
        <div className="flex-1 flex gap-2">
          {normalizedMetadata?.tags ? (
            normalizedMetadata.tags?.map((t: string) => (
              <Tag
                key={t}
                color={
                  PresetColors[Math.floor(Math.random() * PresetColors.length)]
                }
              >
                {t}
              </Tag>
            ))
          ) : (
            <div></div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div>{value.collectCount?.toString() ?? 0} Collected</div>
          <div className="text-gray-500">{fromNow(Number.parseInt(value.timestamp.toString()))}</div>
        </div>
      </div>
    </div>
  );
}
