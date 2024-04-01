import { AssetModule, useAssetHub } from "../..";
import { ICollectModule, UseCollectModule } from "../../core/collect";
import { EtherAddress } from "../../core/common";
import { FeeCollectModuleItem } from "./components/FeeCollectModuleItem";
import { parseFeeInitData } from "./parsedata";
import { PayableOverrides } from "../../client/assethub/abi";
import { formatEther } from "ethers";

function CollectView(props: AssetModule) {
  return <div>Fee Collect,{props.module}</div>;
}

function useFeeCollect(collectModule: AssetModule): UseCollectModule {
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
    viewNode: <CollectView {...collectModule} />,
    collectButtonText: data ? `Collect for ${formatEther(data.amount)} Matic` : undefined
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
