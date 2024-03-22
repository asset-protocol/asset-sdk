import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import { useContext, useState, createContext } from "react";
import { Signer } from "ethers";
import { IStorage, StorageScheme } from "../core/storage";
import { AssetHubConfig, AssetHubPlugin, IAssetHub } from "../core/plugin";
import { HubInfoContext, HubInfoProvider } from "./hub-info";

export type AssetContextData = {
  ctx: IAssetHub;
  storage: IStorage;
  changeHub: (hub?: string) => void;

  account?: string;
  requireLogin: () => void;
};

const AssetContext = createContext<AssetContextData>({} as never);

const queryClient = new QueryClient();

export type AssetProviderProps = {
  hub?: string;
  storage: StorageScheme;
  assetHubManager?: string;
  plugins?: AssetHubPlugin[];

  grapqlClient: ApolloClient<unknown>;

  signer: Signer;
  account?: string;
  requireLogin: () => void;

  children?: React.ReactNode;
};

export function AssetProvider(props: AssetProviderProps) {
  const [hub, setHub] = useState<string | undefined>(props.hub);
  const config = new AssetHubConfig();
  if (props.plugins) {
    props.plugins.forEach((p) => p(config));
  }
  const ctx = config.build();
  const storage = ctx.storages[props.storage];
  if (!storage) throw new Error("storage not found: " + props.storage);
  const value = {
    ctx,
    storage,
    changeHub: setHub,
    account: props.account,
    requireLogin: props.requireLogin,
  };
  let children = props.children;
  config.configProviders.forEach(
    (p) => (children = p({ children: props.children }))
  );
  return (
    <AssetContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={props.grapqlClient}>
          <HubInfoProvider
            signer={props.signer}
            hub={hub}
            assetHubManager={props.assetHubManager}
            children={children}
          />
        </ApolloProvider>
      </QueryClientProvider>
    </AssetContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAssetHub() {
  const ctx = useContext(AssetContext);
  const infoCtx = useContext(HubInfoContext);
  return { ...ctx, ...infoCtx };
}
