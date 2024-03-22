import { NewERC20 } from "../client/assethub";
import { useAssetHub } from "../context";
import { ZeroAddress } from "ethers";
import { useCallback, useMemo } from "react";

export function useERC20BalanceOf(contract: string) {
  const { signer } = useAssetHub();
  const erc20 = useMemo(() => {
    if (contract && contract !== ZeroAddress) {
      return NewERC20(signer, contract);
    }
  }, [signer, contract]);
  const balanceOf = useCallback((account: string) => {
    if (erc20 === undefined) return Promise.resolve(undefined);
    return erc20.balanceOf(account);
  }, [erc20]);
  return balanceOf;
}