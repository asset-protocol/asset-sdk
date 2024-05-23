import { useEffect, useState, createContext, useMemo } from "react";
import { NewAssetHubManager } from "../client/assethub";
import { ContractRunner, Signer } from "ethers";
import { LiteAssetHubManager as AssetHubManager } from "../client/assethub/abi/LiteAssetHubManager";
import { AssetHubManagerInfo, useGetHubManager } from "..";

export interface AssetContractRunner extends ContractRunner {
  isMulti?: boolean
  getAddress(): Promise<string>;
}

export type HubInfoContextData = {
  signer: Signer;

  contractRunner?: AssetContractRunner;
  setContractRunner: (cr?: AssetContractRunner) => void;

  assetHubManager?: AssetHubManager;
  hubManagerInfo?: AssetHubManagerInfo;
};

export const HubInfoContext = createContext<HubInfoContextData>({} as never);

export type HubInfoProviderProps = {
  signer: Signer;
  children?: React.ReactNode;
};

export function HubInfoProvider(props: HubInfoProviderProps) {
  const [hubManager, setHubManager] = useState<AssetHubManager>();
  const [hubManagerInfo, setHubManagerInfo] = useState<AssetHubManagerInfo>();
  const [_contractRunner, setContractRunner] = useState<AssetContractRunner>();

  const contractRunner = useMemo(() => {
    if (_contractRunner) {
      return _contractRunner;
    }
    return props.signer;
  }, [_contractRunner, props.signer])

  const value = {
    signer: props.signer,
    contractRunner, setContractRunner,
    assetHubManager: hubManager,
    hubManagerInfo,
  };

  const { data } = useGetHubManager();
  useEffect(() => {
    if (data && contractRunner?.provider) {
      setHubManager(NewAssetHubManager(contractRunner, data.id));
    } else {
      setHubManager(undefined);
    }
    setHubManagerInfo(data);
  }, [contractRunner, data]);

  return (
    <HubInfoContext.Provider
      value={value}
      children={props.children}
    ></HubInfoContext.Provider>
  );
}
