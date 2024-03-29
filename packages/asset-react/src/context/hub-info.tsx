import { useEffect, useState, createContext } from "react";
import { AssetHub as AssethubContract } from "../client/assethub/abi";
import { NewAssetHub, NewAssetHubManager } from "../client/assethub";
import { Signer } from "ethers";
import { AssetHubManager } from "../client/assethub/abi/AssetHubManager";
import { AssetHubInfo } from "../client/core";
import { useGetAssetHubByNameOrId } from "..";

export type HubInfoContextData = {
  signer: Signer;
  assetHub?: AssethubContract;
  hubInfo?: AssetHubInfo;
  assetHubManager?: AssetHubManager;
};

export const HubInfoContext = createContext<HubInfoContextData>({} as never);

export type HubInfoProviderProps = {
  signer: Signer;
  hub?: string;
  assetHubManager?: string;
  children?: React.ReactNode;
};

export function HubInfoProvider(props: HubInfoProviderProps) {
  const [hubContract, setHubContract] = useState<AssethubContract>();
  const { data: hubData } = useGetAssetHubByNameOrId(props.hub);
  const value = {
    signer: props.signer,
    hubInfo: hubData,
    assetHub: hubContract,
    assetHubManager: props.assetHubManager
      ? NewAssetHubManager(props.signer, props.assetHubManager)
      : undefined,
  };

  useEffect(() => {
    if (hubData) {
      setHubContract(NewAssetHub(props.signer, hubData.id));
    } else {
      setHubContract(undefined);
    }
  }, [hubData, props.signer]);

  return (
    <HubInfoContext.Provider
      value={value}
      children={props.children}
    ></HubInfoContext.Provider>
  );
}
