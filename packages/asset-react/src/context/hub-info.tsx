import { useEffect, useState, createContext } from "react";
import { AssetHub as AssethubContract } from "../client/assethub/abi";
import { NewAssetHub, NewAssetHubManager } from "../client/assethub";
import { Signer } from "ethers";
import { LiteAssetHubManager as AssetHubManager } from "../client/assethub/abi/LiteAssetHubManager";
import { AssetHubInfo } from "../client/core";
import { AssetHubManagerInfo, useGetAssetHubByNameOrId, useGetHubManager } from "..";

export type HubInfoContextData = {
  signer: Signer;
  assetHub?: AssethubContract;
  hubInfo?: AssetHubInfo;
  assetHubManager?: AssetHubManager;
  hubManagerInfo?: AssetHubManagerInfo;
};

export const HubInfoContext = createContext<HubInfoContextData>({} as never);

export type HubInfoProviderProps = {
  signer: Signer;
  hub?: string;
  children?: React.ReactNode;
};

export function HubInfoProvider(props: HubInfoProviderProps) {
  const [hubContract, setHubContract] = useState<AssethubContract>();
  const [hubManager, setHubManager] = useState<AssetHubManager>();
  const [hubManagerInfo, setHubManagerInfo] = useState<AssetHubManagerInfo>();
  const { data: hubData } = useGetAssetHubByNameOrId(props.hub);

  const value = {
    signer: props.signer,
    hubInfo: hubData,
    assetHub: hubContract,
    assetHubManager: hubManager,
    hubManagerInfo,
  };

  useEffect(() => {
    if (hubData) {
      setHubContract(NewAssetHub(props.signer, hubData.id));
    } else {
      setHubContract(undefined);
    }
  }, [hubData, props.signer]);

  const { data } = useGetHubManager();
  useEffect(() => {
    if (data) {
      setHubManager(NewAssetHubManager(props.signer, data.id))
    }
    setHubManagerInfo(data);
  }, [props.signer, data])

  return (
    <HubInfoContext.Provider
      value={value}
      children={props.children}
    ></HubInfoContext.Provider>
  );
}
