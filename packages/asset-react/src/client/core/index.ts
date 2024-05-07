import { AssetMetadata } from "../../core";

export type AssetType = "image" | "video" | "audio" | "markdown" | string;

export type Asset = {
  id: string;
  assetId: bigint;
  hub: string;
  type: AssetType;
  name: string;
  image: string;
  content: string;
  description: string;
  contractAddress: string;
  publisher: string;
  contentUri?: string;
  timestamp: bigint;
  lastUpdatedAt: bigint;
  hash: string;
  tags?: { name: string }[];
  metadata?: AssetMetadata;
  collectModule?: string;
  collectModuleInitData?: string;
  collectNft?: string;
  collectCount?: bigint;
  gatedModule?: string
  gatedModuleInitData?: string
  query1?: string;
  query2?: string;
}

export type AssetHubInfo = {
  id: string
  name: string
  admin: string
  nftGatedModule: string
  feeCollectModule: string
  tokenCollectModule: string
  implementation: string
  timestamp: bigint
  version: string
  hash: string
}
