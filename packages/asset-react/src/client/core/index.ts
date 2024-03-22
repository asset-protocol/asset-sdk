import { AssetMetadata } from "../../core";

export type AssetType = "image" | "video" | "audio" | "markdown" | string;

export type Asset = {
  id: string;
  assetId: bigint;
  name: string;
  type: AssetType;
  contractAddress: string;
  publisher: string;
  contentUri?: string;
  timestamp: bigint;
  hash: string;
  metadata: string;
  normalizedMetadata: AssetMetadata;
  collectModule?: string;
  collectModuleInitData?: string;
  collectNft?: string;
  collectCount?: bigint;
  gatedModule?: string
  gatedModuleInitData?: string
}

export type AssetHubInfo = {
  id: string
  name: string
  admin: string
  nftGatedModule: string
  feeCollectModule: string
  implementation: string
  timestamp: bigint
  version: string
  hash: string
}