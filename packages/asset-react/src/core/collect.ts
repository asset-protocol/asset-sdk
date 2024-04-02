import { ReactElement, ReactNode } from "react";
import { EtherAddress } from "./common";
import { AssetModule } from "./asset";
import { BytesLike } from "ethers";
import { PayableOverrides } from "../client/assethub/abi";
import { Asset } from "../client/core";

export type BeforeCollectFunc = (assetId: bigint, options: PayableOverrides) => boolean | Promise<boolean>;

export type CollectModuleInputProps = {
  value?: BytesLike;
  onChange?: (v?: BytesLike) => void;
}

export type UseCollectModule = {
  viewNode?: ReactNode;
  collectButtonText?: ReactNode;
  errorText?: ReactNode;
  beforeCollect?: BeforeCollectFunc;
}

export interface ICollectModule {
  // module contract address
  moduleContract: EtherAddress;
  // module label
  label: string;
  inputNode: ReactElement<CollectModuleInputProps>;
  useCollect(asset: Asset, collectModule: AssetModule): UseCollectModule;
}