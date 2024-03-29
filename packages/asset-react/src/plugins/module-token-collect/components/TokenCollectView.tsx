import { ZeroAddress, formatEther } from "ethers";
import { useERC20BalanceOf } from "../../../hook";
import { TokenCollectConfig } from "../parsedata";
import { useEffect, useMemo, useState } from "react";
import { useAssetHub } from "../../../context";
import { AddressLink } from "../../../components";

export function CollectView({ config }: { config: TokenCollectConfig }) {
  // <div className="text-red-400">
  //   {`Requires a minimum token balance of ${collectModuleData?.amount.toString()}, current: ${balance?.toString()}`}
  // </div>
  return (
    <>
      <div className="my-1">
        Token Contract:
        <AddressLink address={config.currency} to="" className="mx-2" />
      </div>
      <div className="my-1">
        Token Recipient:
        <AddressLink address={config.recipient} to="" className="mx-2" />
      </div>
    </>
  );
}

export function NoBalanceText({ config }: { config: TokenCollectConfig }) {
  const { account } = useAssetHub();
  const erc20BalanceOf = useERC20BalanceOf(config.currency ?? ZeroAddress);
  const [balance, setBalance] = useState<bigint>();

  const hasNoBalance = useMemo(
    () => (balance && balance < config.amount) ?? false,
    [balance, config]
  );

  console.log("hasNoBalance", hasNoBalance);

  useEffect(() => {
    if (account) {
      erc20BalanceOf(account.address).then((b) =>
        setBalance(b === undefined ? b : BigInt(b))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [erc20BalanceOf, account]);
  if (!hasNoBalance) return null;
  return (
    <div className="text-red-400">
      {`Requires a minimum token balance of ${formatEther(
        config.amount
      )}, current: ${formatEther(balance!)}`}
    </div>
  );
}
