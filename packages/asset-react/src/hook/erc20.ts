import { NewERC20 } from "../client/assethub";
import { useAssetHub } from "../context";
import { ZeroAddress } from "ethers";
import { useCallback } from "react";

export function useERC20BalanceOf(contract: string) {
  const { signer } = useAssetHub();
  const balanceOf = useCallback((account: string) => {
    let erc20;
    if (contract && contract !== ZeroAddress) {
      erc20 = NewERC20(signer, contract);
    }
    if (erc20 === undefined) return Promise.resolve(undefined);
    return erc20.balanceOf(account);
  }, [contract, signer]);
  return balanceOf;
}