import { ReactNode, createContext, useContext, useState } from "react";
import { AssetMetadata } from "../../core";
import { Asset } from "../..";

export type CollectModule = {
  collectModule: string;
  collectModuleInitData?: string;
};
export type GatedModule = {
  collectModule: string;
  collectModuleInitData?: string;
};

export type AssetMetadataEditData = Omit<AssetMetadata, "type" | "content">;

export type AssetEditorContextData = {
  assetId?: bigint;
  type?: string;
  setType: (t?: string) => void;

  metadata?: AssetMetadataEditData;
  setMetadata(m?: AssetMetadataEditData): void;

  content?: string;
  setContent: (c?: string) => void;

  collectModule?: CollectModule;
  setCollectModule(m?: CollectModule): void;

  gatedModule?: GatedModule;
  setGatedModule(m?: GatedModule): void;
};

const AssetEditorContext = createContext<AssetEditorContextData>(
  {} as AssetEditorContextData
);

export type AssetEditorProviderProps = {
  asset?: Asset;
  children?: ReactNode;
  onPublished?: (assetId: bigint) => void;
};

function useAsetMeataData(asset?: Asset) {
  return useState<AssetMetadataEditData | undefined>(() => {
    return asset && asset.normalizedMetadata;
  });
}

export function AssetEditorProvider(props: AssetEditorProviderProps) {
  const { children, asset } = props;
  const [type, setType] = useState<string>();
  const [metadata, setMetadata] = useAsetMeataData(asset);
  const [content, setContent] = useState<string>();
  const [collectModule, setCollectModule] = useState<CollectModule>();
  const [gatedModule, setGatedModule] = useState<GatedModule>();

  const value: AssetEditorContextData = {
    assetId: asset?.assetId,
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
