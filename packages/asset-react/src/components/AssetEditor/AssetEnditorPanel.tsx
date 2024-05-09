import { Affix, Button, Select } from "antd";
import { AssetPublishModal } from "./AssetPublishModal";
import { useAssetTypes } from "../../hook";
import { useAssetEditor } from "./AssetEditorContext";
import { useEffect, useMemo, useState } from "react";
import { useAssetHub } from "../../context";
import clsx from "clsx";

export function AssetEditorPanel(props: {
  onPublished?: (hub: string, assetId: bigint) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const getAssetTypes = useAssetTypes();
  const assetTypeOptions = getAssetTypes();
  const { type, setType, content, metadata, publishedAssetId, hub } =
    useAssetEditor();
  const { account, requireLogin } = useAssetHub();

  const canPublish = useMemo(() => {
    return content && metadata?.name && metadata?.image;
  }, [content, metadata]);

  useEffect(() => {
    if (publishedAssetId) {
      setOpen(false);
      props.onPublished?.(hub!, publishedAssetId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishedAssetId]);

  return (
    <Affix offsetTop={0}>
      <div
        className={clsx(
          "flex items-center justify-end gap-4 px-2 bg-[#ffffff99] py-4 backdrop-blur-lg",
          props.className
        )}
      >
        <Select
          size="large"
          className="w-[160px]"
          value={type}
          options={assetTypeOptions}
          onChange={setType}
        ></Select>
        <Button
          type="primary"
          size="large"
          disabled={!canPublish}
          onClick={() => {
            if (account) {
              setOpen(true);
            } else {
              requireLogin?.();
            }
          }}
        >
          Publish
        </Button>
        <AssetPublishModal open={open} onCancel={() => setOpen(false)} />
      </div>
    </Affix>
  );
}
