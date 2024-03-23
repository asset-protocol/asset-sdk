import { ReactNode, createContext, useContext, useState } from "react";
import { AssetMetadata, AssetModule } from "../../core";
import { Asset } from "../../client/core";

export type AssetMetadataEditData = Omit<AssetMetadata, "type" | "content">;

export type AssetEditorContextData = {
  asset?: Asset;
  type: string;
  setType: (t: string) => void;

  metadata?: AssetMetadataEditData;
  setMetadata(m?: AssetMetadataEditData): void;

  content?: string;
  setContent: (c?: string) => void;

  collectModule?: AssetModule;
  setCollectModule(m?: AssetModule): void;

  gatedModule?: AssetModule;
  setGatedModule(m?: AssetModule): void;

  publishedAssetId: false | bigint;
  setPublished(assetId: bigint): void;
};

const AssetEditorContext = createContext<AssetEditorContextData>(
  {} as AssetEditorContextData
);

export type AssetEditorProviderProps = {
  asset?: Asset;
  children?: ReactNode;
};

function useAsetMeataData(asset?: Asset) {
  return useState<AssetMetadataEditData | undefined>(() => {
    return asset && asset.normalizedMetadata;
  });
}

export function AssetEditorProvider(props: AssetEditorProviderProps) {
  const { children, asset } = props;
  const [type, setType] = useState<string>(asset?.type ?? "video");
  const [metadata, setMetadata] = useAsetMeataData(asset);
  const [content, setContent] = useState<string | undefined>(
    asset?.normalizedMetadata.content
  );
  const [collectModule, setCollectModule] = useState<AssetModule | undefined>(
    () => {
      if (asset?.collectModule) {
        return {
          module: asset.collectModule,
          initData: asset.collectModuleInitData,
        };
      }
      return undefined;
    }
  );
  const [gatedModule, setGatedModule] = useState<AssetModule | undefined>(
    () => {
      if (asset?.gatedModule) {
        return {
          module: asset.gatedModule,
          initData: asset.gatedModuleInitData,
        };
      }
      return undefined;
    }
  );
  const [publishedAssetId, setPublished] = useState<bigint | false>(false);

  const value: AssetEditorContextData = {
    asset: asset,
    type,
    setType: (t) => {
      const cachedContent = localStorage.getItem("asset:conent:" + t);
      if (cachedContent) {
        setContent(cachedContent);
      } else {
        setContent(undefined);
      }
      setType(t);
    },
    metadata,
    setMetadata,
    content,
    setContent,
    collectModule,
    setCollectModule,
    gatedModule,
    setGatedModule,
    publishedAssetId: publishedAssetId,
    setPublished: setPublished,
  };

  return (
    <AssetEditorContext.Provider
      value={value}
      children={children}
    ></AssetEditorContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAssetEditor() {
  return useContext(AssetEditorContext);
}
