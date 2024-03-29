import { AssetHubConfig, EtherAddress } from "../../core";
import { FeeCollectModule } from "./FeeCollectModule";

export default function FeeCollectModulePlugin(feeCollectContract: EtherAddress) {
  return (config: AssetHubConfig) => {
    config.registerCollectModule(FeeCollectModule(feeCollectContract));
  };
}

export * from './FeeCollectModule';