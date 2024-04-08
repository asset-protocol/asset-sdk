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

export function useHubERC20Approve() {
  const { signer, account, hubManagerInfo } = useAssetHub();
  const approve = useCallback(async (contract: string, amount: bigint) => {
    console.log("erc20", contract);
    if (signer.provider && account && amount > 0n && hubManagerInfo) {
      const token = NewERC20(signer, contract);
      const allowance = await token.allowance(
        signer.getAddress(),
        hubManagerInfo.globalModule
      );
      if (allowance < amount) {
        const tx = await token.approve(hubManagerInfo.globalModule, amount);
        await tx.wait();
      }
      return true;
    }
    return false;
  }, [signer])

  return { approve };

}