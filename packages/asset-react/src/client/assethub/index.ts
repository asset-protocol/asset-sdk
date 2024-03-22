import { Addressable, Contract, Signer } from "ethers";
import { IERC20Abi, assethubAbi, assethubManagerAbi } from "./abi";
import { AssetHub } from "./typechain-types/AssetHub";
import { AssetHubManager } from "./typechain-types/AssetHubManager";

import { IERC20 } from "./typechain-types/IERC20";
export * from './typechain-types/AssetHub';
export * as AssetHubManager from './typechain-types/AssetHubManager';
export * as IERC20 from './typechain-types/IERC20';


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
