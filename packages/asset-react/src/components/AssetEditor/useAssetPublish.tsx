import { useAssetEditor } from "./AssetEditorContext";
import { useAssetHub } from "../../context";
import {
  UpdateAssetInput,
  useCreateAsset,
  useUpdateAsset,
} from "../../hook";
import { ZERO_BYTES } from "../../core";
import { useState } from "react";

export function useAssetPublish() {
  const { metadata, collectModule, gatedModule, content, type, asset } =
    useAssetEditor();
  const { storage } = useAssetHub();
  const { create } = useCreateAsset();
  const { update } = useUpdateAsset();

  const [loading, setLoading] = useState(false);

  const publish = async () => {
    setLoading(true);
    let assetId = asset?.assetId;
    try {
      const newData: UpdateAssetInput = {};
      const data = { ...metadata, type, content };
      if (metadata?.image?.startsWith("blob:")) {
        const image = await fetch(metadata.image).then((res) => res.blob());
        data.image = await storage.upload({
          data: image,
        });
      }
      const newMetadata = JSON.stringify(data);
      if (newMetadata !== asset?.metadata) {
        newData.contentURI = await storage.upload({
          data: newMetadata,
        });
      }
      if (
        collectModule?.module !== asset?.collectModule ||
        collectModule?.initData !== asset?.collectModuleInitData
      ) {
        newData.collectModule = collectModule?.module;
        newData.collectModuleInitData = collectModule?.initData;
      }
      if (
        gatedModule?.module !== asset?.gatedModule ||
        gatedModule?.initData !== asset?.gatedModuleInitData
      ) {
        newData.gatedModule = gatedModule?.module;
        newData.gatedModuleInitData = gatedModule?.initData;
      }
      if (asset) {
        assetId = asset.assetId;
        await update(asset.assetId, newData);
      } else {
        assetId = await create({
          ...newData,
          assetCreateModuleData: ZERO_BYTES,
        });
      }
    } finally {
      setLoading(false);
    }
    return assetId;
  };
  return { publish, loading };
}
