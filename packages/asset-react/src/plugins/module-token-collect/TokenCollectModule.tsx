import { useAssetHub } from "../../context";
import { AssetModule, EtherAddress } from "../../core";
import { ICollectModule, UseCollectModule } from "../../core/collect";
import {
  Erc20Token,
  TokenCollectModuleItem,
} from "./components/TokenCollectModuleItem";
import { parseTokenCollectInitData } from "./parsedata";
import { TokenCollectView, NoBalanceText } from "./components/TokenCollectView";
import { NewERC20 } from "../../client/assethub";
import { formatEther } from "ethers";
import { Asset } from "../../client/core";

function useTokenCollect(
  asset: Asset,
  collectModule: AssetModule,
  tokens: Erc20Token[]
): UseCollectModule {
  const { signer, account } = useAssetHub();
  const data = parseTokenCollectInitData(collectModule.initData);
  const tokenInfo = tokens.find((t) => t.contract === data?.currency);
  const amount = data!.amount;
  async function func() {
    if (data && signer.provider && account) {
      const token = NewERC20(signer, data.currency);
      const allowance = await token.allowance(
        signer.getAddress(),
        collectModule.module
      );
      if (allowance < amount) {
        const tx = await token.approve(collectModule.module, amount);
        await tx.wait();
      }
      return true;
    }
    return false;
  }
  return {
    beforeCollect: func,
    viewNode: data && <TokenCollectView config={data} tokenInfo={tokenInfo} publisher={asset.publisher} />,
    collectButtonText: `Collect for ${formatEther(data!.amount)} ${tokenInfo?.name ? "$" + tokenInfo.name : "Token"
      }`,
    errorText: data && <NoBalanceText config={data} />,
  };
}

export type TokenCollectModuleOptions = {
  moduleContract: EtherAddress;
  tokens: Erc20Token[];
};

export function TokenCollectModule(
  opts: TokenCollectModuleOptions
): ICollectModule {
  return {
    moduleContract: opts.moduleContract,
    label: "Collect for Token",
    inputNode: (
      <TokenCollectModuleItem
        module={opts.moduleContract}
        tokens={opts.tokens}
      />
    ),
    useCollect: (asset, module) => useTokenCollect(asset, module, opts.tokens),
  };
}
