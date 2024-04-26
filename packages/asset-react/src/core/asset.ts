import { BytesLike } from "ethers";

export type AssetMetadata = {
  type: string;
  name: string;
  content: string;
  description?: string;
  image?: string;
  tags?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties?: { [key in string]: any };
}

export type AssetModule = {
  module: string;
  initData?: BytesLike;
};
