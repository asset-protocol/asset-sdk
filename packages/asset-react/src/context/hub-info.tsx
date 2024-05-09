import { useEffect, useState, createContext } from "react";
import { NewAssetHubManager } from "../client/assethub";
import { Signer } from "ethers";
import { LiteAssetHubManager as AssetHubManager } from "../client/assethub/abi/LiteAssetHubManager";
import { AssetHubManagerInfo, useGetHubManager } from "..";

export type HubInfoContextData = {
  signer: Signer;
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

  const value = {
    signer: props.signer,
    assetHubManager: hubManager,
    hubManagerInfo,
  };

  const { data } = useGetHubManager();
  useEffect(() => {
    if (data && props.signer?.provider) {
      setHubManager(NewAssetHubManager(props.signer, data.id));
    }
    setHubManagerInfo(data);
  }, [props.signer, data]);

  return (
    <HubInfoContext.Provider
      value={value}
      children={props.children}
    ></HubInfoContext.Provider>
  );
}
