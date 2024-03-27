import { InputNumber } from "antd";
import { CollectModuleContentProps } from "./CollectModuleInput";
import { AddressLink } from "../Address/AddressLink";
import { useAssetHub } from "../..";
import { useEffect, useState } from "react";
import { AbiCoder, ZeroAddress } from "ethers";
import { BytesLike } from "ethers";

type FeeConfig = {
  recipient: string;
  amount: number;
};

function parseFeeInitData(data?: BytesLike): FeeConfig | undefined {
  if (!data || data == "0x") {
    return;
  }
  const res = AbiCoder.defaultAbiCoder().decode(["address", "uint256"], data);
  return {
    recipient: res[0],
    amount: res[1],
  };
}

function encodeFeeInitData(config?: FeeConfig) {
  if (!config) {
    return;
  }
  const res = AbiCoder.defaultAbiCoder().encode(
    ["address", "uint256"],
    [config.recipient, config.amount]
  );
  return res;
}

export function FeeCollectModuleItem(props: CollectModuleContentProps) {
  const { account } = useAssetHub();

  const data =
    props.module === props.value?.module
      ? parseFeeInitData(props.value?.initData)
      : undefined;
  const [amount, setAmount] = useState<number | null>(data?.amount ?? null);

  useEffect(() => {
    const recipient = data?.recipient ?? ZeroAddress;
    if (recipient && amount) {
      const initData = encodeFeeInitData({ recipient, amount });
      props.onChange?.(initData);
    } else {
      props.onChange?.(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, amount, data]);

  return (
    <div>
      <div className="flex flex-wrap items-center mt-2">
        <span className="w-[64px]">Token</span>
        <InputNumber<number>
          className="flex-1 ml-2"
          placeholder="Amount"
          min={0}
          style={{ width: 100 }}
          value={amount}
          onChange={(t) => setAmount(t)}
          addonAfter="MATIC"
        />
      </div>
      Funds will be sent to
      <AddressLink address={data?.recipient ?? account?.address} />
    </div>
  );
}
