import { useAssetEditor } from "./AssetEditorContext";
import { useAssetHub } from "../../context";
import {
  UpdateAssetInput,
  useCreateAsset,
  useHubERC20Approve,
  useEditorProvider,
  useUpdateAsset,
} from "../../hook";
import { AssetModule, ZERO_BYTES } from "../../core";
import { useMemo, useState } from "react";
import { ZeroAddress } from "ethers";
import { AssetTokenConfigStructOutput } from "../../client/assethub/abi/TokenGlobalModule";

export type PublishFromDataType = {
  // storage: StorageScheme;
  useCollect: boolean;
  hub?: string;
  collectModule?: AssetModule;
  gatedModule?: AssetModule;
};

export function usePublishFormValues() {
  const { collectModule, hub } = useAssetEditor();
  const initialValues: PublishFromDataType = useMemo(() => {
    return {
      useCollect:
        (collectModule && collectModule.module !== ZeroAddress) ?? false,
      collectModule,
      hub,
    };
  }, [collectModule, hub]);
  return initialValues;
}

export function useAssetPublish() {
  const { metadata, setCollectModule, setGatedModule, content, type, asset } =
    useAssetEditor();
  const { storage } = useAssetHub();
  const { create } = useCreateAsset();
  const { update } = useUpdateAsset();
  const editor = useEditorProvider()(type);
  const beforePublish = editor.useBeforePublish?.();
  const { approve } = useHubERC20Approve();

  const [loading, setLoading] = useState(false);
  const [tip, setTip] = useState<string>();

  const publish = async (
    values: PublishFromDataType,
    config?: AssetTokenConfigStructOutput
  ) => {
    setLoading(true);
    let assetId = asset?.assetId;
    try {
      if (!values.hub) {
        throw new Error("Please select a hub");
      }
      const newData: UpdateAssetInput = {};
      let newConent = content;
      setTip("Saving content...");
      if (content && beforePublish) {
        newConent = await beforePublish(content, asset?.content, (p) => {
          setTip(`Saving content(${p})...`);
        });
      }
      const data = { ...metadata, type, content: newConent };
      setTip("Saving image...");
      if (metadata?.image?.startsWith("blob:")) {
        const image = await fetch(metadata.image).then((res) => res.blob());
        data.image = await storage.upload({
          data: image,
        });
      }
      setTip("Saving metadata...");
      if (data.description !== asset?.description) {
        data.tags =
          data.description?.match(/#\w+/g)?.map((t) => t.slice(1)) || undefined;
      }
      const newMetadata = JSON.stringify(data);
      if (newMetadata !== JSON.stringify(asset?.metadata)) {
        newData.contentURI = await storage.upload({
          data: newMetadata,
        });
      }
      const collectModule = values.collectModule;
      if (
        values.collectModule?.module !== asset?.collectModule ||
        collectModule?.initData !== asset?.collectModuleInitData
      ) {
        newData.collectModule = collectModule?.module;
        newData.collectModuleInitData = collectModule?.initData;
      }
      const gatedModule = values.gatedModule;
      if (
        gatedModule?.module !== asset?.gatedModule ||
        gatedModule?.initData !== asset?.gatedModuleInitData
      ) {
        newData.gatedModule = gatedModule?.module;
        newData.gatedModuleInitData = gatedModule?.initData;
      }

      if (asset) {
        assetId = asset.assetId;
        setTip("Updating asset...");
        if (config) {
          await approve(config.token, config.updateFee);
        }
        await update(values.hub, asset.assetId, newData);
      } else {
        setTip("Ceating asset...");
        if (config) {
          await approve(config.token, config.createFee);
        }
        assetId = await create(values.hub, {
          ...newData,
          assetCreateModuleData: ZERO_BYTES,
        });
      }
      setCollectModule(values.collectModule);
      setGatedModule(values.gatedModule);
      setTip("Asset Published");
    } finally {
      setLoading(false);
      setTip(undefined);
    }
    return assetId;
  };
  return { publish, loading, tip };
}
