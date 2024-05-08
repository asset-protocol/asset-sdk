import { AssetHubConfig, EtherAddress } from "../../core";
import { FeeCollectModule } from "./FeeCollectModule";

export default function FeeCollectModulePlugin(feeCollectContract: EtherAddress) {
  return (config: AssetHubConfig) => {
    return config.registerCollectModule(FeeCollectModule(feeCollectContract));
  };
}

export * from './FeeCollectModule';