import { Button, Select } from "antd";
import { AssetPublishModal } from "./AssetPublishModal";
import { useAssetTypes } from "../../hook";
import { useAssetEditor } from "./AssetEditorContext";
import { useMemo, useState } from "react";
import { useAssetHub } from "../../context";

export function AssetEditorPanel() {
  const [open, setOpen] = useState(false);

  const getAssetTypes = useAssetTypes();
  const assetTypeOptions = getAssetTypes();
  const { type, setType, content, metadata } = useAssetEditor();
  const { account, requireLogin } = useAssetHub();

  const canPublish = useMemo(() => {
    return content && metadata?.name && metadata?.image;
  }, [content, metadata]);

  return (
    <div className="flex items-center justify-end gap-4">
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
  );
}
