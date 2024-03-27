import { InputNumber, Select } from "antd";
import { CollectModuleContentProps } from "./CollectModuleInput";
import { AddressLink } from "../Address/AddressLink";
import { parseTokenCollectModuleInitData } from "../../core";
import { useAssetHub } from "../..";
import { useEffect, useState } from "react";
import { AbiCoder, ZeroAddress } from "ethers";

const TestToken = "0xc2ADF187D9B064F68FcD8183195cddDB33E10E8F";

export function TokenCollectModuleItem(props: CollectModuleContentProps) {
  const { account } = useAssetHub();
  const data =
    props.module === props.value?.module
      ? parseTokenCollectModuleInitData(props.value?.initData)
      : undefined;
  const tokenOptions = [
    {
      label: "Test Token",
      value: TestToken,
    },
  ];
  const [selectedToken, setSelectedToken] = useState<string | undefined>(
    data?.currency ?? tokenOptions[0].value
  );
  const [amount, setAmount] = useState<number | null>(data?.amount ?? null);

  useEffect(() => {
    const recipient = data?.recipient ?? ZeroAddress;
    if (recipient && selectedToken && amount) {
      const initData = AbiCoder.defaultAbiCoder().encode(
        ["address", "address", "uint256"],
        [selectedToken, recipient, amount]
      );
      props.onChange?.(initData);
    } else {
      props.onChange?.(undefined);
    }
  }, [account, amount, data, props, selectedToken]);

  return (
    <div>
      <div className="flex flex-wrap items-center mt-2">
        <span className="w-[64px]">Token</span>
        <Select
          options={tokenOptions}
          style={{ width: 170 }}
          title={selectedToken}
          value={selectedToken}
          onChange={(v) => setSelectedToken(v)}
        ></Select>
        <InputNumber<number>
          className="flex-1 ml-2"
          placeholder="Amount"
          min={0}
          style={{ width: 100 }}
          value={amount}
          onChange={(t) => setAmount(t)}
        />
      </div>
      Funds will be sent to
      <AddressLink address={data?.recipient ?? account?.address} />
    </div>
  );
}
