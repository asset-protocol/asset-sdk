import { Addressable, Contract, Signer } from "ethers";
import { CurationAbi, IERC20Abi, TokenGlobalModuleAbi, assethubAbi, assethubManagerAbi } from "./abi/abi";
import { AssetHub } from "./abi/AssetHub";
import { LiteAssetHubManager as AssetHubManager } from "./abi/LiteAssetHubManager";
import { IERC20 } from "./abi/IERC20";
import { TokenGlobalModule } from "./abi/TokenGlobalModule";
import { Curation } from "./abi/Curation";
export * from './abi/AssetHub';
export * as AssetHubManager from './abi/LiteAssetHubManager';
export * as IERC20 from './abi/IERC20';


export function NewAssetHub(signer: Signer, hub: string | Addressable) {
  const ct = new Contract(hub, assethubAbi, signer) as unknown;
  return ct as AssetHub;
}

export function NewAssetHubManager(signer: Signer, manager: string | Addressable) {
  const ct = new Contract(manager, assethubManagerAbi, signer) as unknown;
  return ct as AssetHubManager;
}

export function NewERC20(signer: Signer, addr: string) {
  const ct = new Contract(addr, IERC20Abi, signer) as unknown;
  return ct as IERC20;
}
export function NewTokenGlobalModule(signer: Signer, addr: string) {
  const ct = new Contract(addr, TokenGlobalModuleAbi, signer) as unknown;
  return ct as TokenGlobalModule;
}

export function NewCuration(signer: Signer, addr: string) {
  const ct = new Contract(addr, CurationAbi, signer) as unknown;
  return ct as Curation;
}
