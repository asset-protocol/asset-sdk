import { ICollectModule, UseCollectModule } from "../../core/collect";
import { EtherAddress } from "../../core/common";
import { FeeCollectModuleItem } from "./components/FeeCollectModuleItem";
import { FeeConfig, parseFeeInitData } from "./parsedata";
import { PayableOverrides } from "../../client/assethub/abi";
import { ZeroAddress, formatEther } from "ethers";
import { Asset } from "../../client/core";
import { AssetModule } from "../../core";
import { useAssetHub } from "../../context";
import { AddressLink } from "../../components";

export type FeeCollectViewProps = {
  config?: FeeConfig;
  publisher: EtherAddress;
}

function FeeCollectView({ config, publisher }: FeeCollectViewProps) {
  const recipient = config?.recipient === ZeroAddress ? publisher : config?.recipient;
  return <div className="my-1">
    Recipient:
    <AddressLink address={recipient} to="" className="mx-2" />
  </div>
}

function useFeeCollect(asset: Asset, collectModule: AssetModule): UseCollectModule {
  const { signer, account } = useAssetHub();
  const data = parseFeeInitData(collectModule.initData);
  async function func(_: bigint, options: PayableOverrides) {
    if (data && signer.provider && account) {
      const balance = await signer.provider.getBalance(account.address);
      const amount = data.amount;
      if (amount >= balance) {
        return false;
      }
      options.value = amount;
      return true;
    }
    return false;
  }
  return {
    beforeCollect: func,
    viewNode: <FeeCollectView config={data} publisher={asset.publisher} />,
    collectButtonText: data ? `Collect for ${formatEther(data.amount)} MATIC` : undefined
  };
}

export function FeeCollectModule(contract: EtherAddress): ICollectModule {
  return {
    moduleContract: contract,
    label: "Fee Collect",
    inputNode: <FeeCollectModuleItem module={contract} />,
    useCollect: useFeeCollect,
  };
}
