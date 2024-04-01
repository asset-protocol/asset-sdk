import { InputNumber } from "antd";
import { CollectModuleContentProps } from "../../../components/AssetEditor/CollectModuleInput";
import { AddressLink } from "../../../components/Address/AddressLink";
import { useAssetHub } from "../../..";
import { useEffect, useMemo, useState } from "react";
import { encodeFeeInitData, parseFeeInitData } from "../parsedata";
import { ZeroAddress, formatEther, parseEther } from "ethers";

export function FeeCollectModuleItem(props: CollectModuleContentProps) {
  const { account, signer } = useAssetHub();
  const data = useMemo(() => parseFeeInitData(props.value), [props.value]);
  const [amount, setAmount] = useState<string | null>(
    data?.amount ? formatEther(data.amount) : null
  );
  signer.provider?.getNetwork().then((network) => {
    console.log(network);
    network.name;
  });
  useEffect(() => {
    const recipient = data?.recipient ?? ZeroAddress;
    if (amount) {
      const initData = encodeFeeInitData({
        recipient,
        amount: parseEther(amount.toString()),
      });
      props.onChange?.(initData);
    } else {
      props.onChange?.(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  return (
    <div>
      <div className="flex flex-wrap items-center mt-2">
        <span className="w-[64px]">Token</span>
        <InputNumber<string>
          className="flex-1 ml-2"
          placeholder="Amount"
          min={"0"}
          style={{ width: 100 }}
          value={amount}
          onChange={(t) => setAmount(t)}
          addonAfter="MATIC"
        />
      </div>
      Funds will be sent to
      <AddressLink
        address={
          !data?.recipient || data.recipient === ZeroAddress
            ? account?.address
            : data.recipient
        }
      />
    </div>
  );
}
