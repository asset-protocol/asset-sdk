/* eslint-disable react-hooks/exhaustive-deps */
import { useAssetHub } from "../../context";
import { parseFeeCollectModuleInitData } from "../../core/collect";
import { useCurrentAsscount } from "../../hook/core";
import { Button, InputNumber, Select, Switch } from "antd";
import { AbiCoder, ZeroAddress } from "ethers";
import { BytesLike } from "ethers";
import { useEffect, useState } from "react";

export type CollectModuleValue = {
  module: string;
  data: BytesLike;
};

export type FeeAssetCollectionInputProps = {
  value?: CollectModuleValue;
  onChange?: (value?: CollectModuleValue) => void;
};

const TestToken = "0xc2ADF187D9B064F68FcD8183195cddDB33E10E8F";

export function FeeAssetCollectionInput(props: FeeAssetCollectionInputProps) {
  const { onChange } = props;
  const data = parseFeeCollectModuleInitData(props.value?.data);

  const { hubInfo } = useAssetHub();
  const account = useCurrentAsscount();
  const [opts, setOpts] = useState<{ label: string; value: string }[]>();
  const [tokens, setTokens] = useState<{ label: string; value: string }[]>();
  const [useCollect, setUseCollect] = useState(
    props.value && props.value.module !== ZeroAddress
  );
  const [selectedModule, setSelectedModule] = useState<string | undefined>(
    props.value?.module
  );
  const [selectedToken, setSelectedToken] = useState<string | undefined>(
    data?.currency
  );
  const [amount, setAmount] = useState<number | null>(data?.amount ?? null);

  useEffect(() => {
    if (onChange) {
      if (!useCollect) {
        onChange(undefined);
        return;
      }
      if (selectedModule && selectedToken && amount) {
        const initData = AbiCoder.defaultAbiCoder().encode(
          ["address", "address", "uint256"],
          [selectedToken, data?.recipient ?? account, amount]
        );
        onChange({
          module: selectedModule,
          data: initData,
        });
      } else {
        onChange(undefined);
      }
    }
  }, [amount, selectedModule, selectedToken, useCollect]);

  useEffect(() => {
    if (hubInfo) {
      setOpts([{ label: "Fee Collect", value: hubInfo.feeCollectModule }]);
      if (!selectedModule) {
        setSelectedModule(hubInfo.feeCollectModule);
      }
      setTokens([
        {
          label: "Test Token",
          value: TestToken,
        },
      ]);
      if (!selectedToken) {
        setSelectedToken(TestToken);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hubInfo, selectedToken]);

  return (
    <div>
      <div className="flex justify-between">
        Collect Module:
        <Switch value={useCollect} onChange={(v) => setUseCollect(v)} />
      </div>
      {useCollect && (
        <div className="ml-4 mt-2">
          <div className="flex flex-wrap gap-2 items-center">
            Module:
            <Select
              style={{ width: 160 }}
              title={selectedModule}
              options={opts}
              value={selectedModule}
              onChange={(t) => setSelectedModule(t)}
            ></Select>
            Token:
            <Select
              options={tokens}
              style={{ width: 160 }}
              title={selectedToken}
              value={selectedToken}
              onChange={(v) => setSelectedToken(v)}
            ></Select>
            Amount:
            <InputNumber<number>
              min={0}
              style={{ width: 100 }}
              value={amount}
              onChange={(t) => setAmount(t)}
            />
          </div>
          Funds will be sent to{" "}
          <Button type="link" className="p-0 text-base ml-2">
            {data?.recipient ?? account}
          </Button>
        </div>
      )}
    </div>
  );
}
