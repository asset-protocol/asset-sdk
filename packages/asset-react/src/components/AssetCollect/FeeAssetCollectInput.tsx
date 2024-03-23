/* eslint-disable react-hooks/exhaustive-deps */
import { AddressLink } from "..";
import { useAssetHub } from "../../context";
import { AssetModule } from "../../core";
import { parseFeeCollectModuleInitData } from "../../core/collect";
import { useCurrentAsscount } from "../../hook/core";
import { InputNumber, Select, Switch } from "antd";
import { AbiCoder, ZeroAddress } from "ethers";
import { useEffect, useState } from "react";

export type FeeAssetCollectionInputProps = {
  value?: AssetModule;
  onChange?: (value?: AssetModule) => void;
};

const TestToken = "0xc2ADF187D9B064F68FcD8183195cddDB33E10E8F";

export function FeeAssetCollectionInput(props: FeeAssetCollectionInputProps) {
  const { onChange } = props;
  const data = parseFeeCollectModuleInitData(props.value?.initData);

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
          initData: initData,
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
        Collect Setting:
        <Switch value={useCollect} onChange={(v) => setUseCollect(v)} />
      </div>
      {useCollect && (
        <div className="px-4 pt-2 rounded-lg bg-gray-100">
          <div className="flex items-center">
            <span className="w-[64px]">Module</span>
            <Select
              style={{ width: 170 }}
              title={selectedModule}
              options={opts}
              value={selectedModule}
              onChange={(t) => setSelectedModule(t)}
            ></Select>
          </div>
          <div className="flex flex-wrap items-center mt-2">
            <span className="w-[64px]">Token</span>
            <Select
              options={tokens}
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
          Funds will be sent to{" "}
          <AddressLink address={data?.recipient ?? account} />
        </div>
      )}
    </div>
  );
}
