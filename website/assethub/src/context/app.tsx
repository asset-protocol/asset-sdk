import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { useAccount, WagmiProvider } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import {
  AssetProvider,
  ipfsPinataPlugin,
  allAssetTypePlugin,
  arwaveStoragePlugin,
} from "@asset-protocol/react";
import { AssetHubManager } from "./consts";
import { useEthersSigner } from "./ether";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const queryClient = new QueryClient();
const config = getDefaultConfig({
  appName: "Asset Demo App",
  projectId: "17557b1e86e0cb2f1a007a122223ddbf",
  chains: [polygonMumbai],
});
const JWTOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkMjFmMjUzMi01ODMxLTRmZTgtODAwMi01ODkxMjA2MjE4MjMiLCJlbWFpbCI6IndhaXRlMXhAb3V0bG9vay5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiN2E0OWNiM2Q2OTM3NTQ4YzMzMjEiLCJzY29wZWRLZXlTZWNyZXQiOiJkNWYxZWY2NDkyMWMwMTc2YzYyNTkyYTNhNTZkMzc3MmVlYWY3NmIwZjFkZGE4Y2RhYmY1NzA2NGYyYjQ3OTYxIiwiaWF0IjoxNzEwNDg0MjIxfQ.sQp8EB2l716fjOqG8Uj2n4zitR1wBQ3-IsiKlZ6XVOo";

function AppAssetHubProvider(props: { children: React.ReactNode }) {
  const signer = useEthersSigner();
  const account = useAccount();
  const { openConnectModal } = useConnectModal();
  const plugins = [
    ipfsPinataPlugin({ jwtToken: JWTOKEN, gateway: "https://ipfs.io" }),
    arwaveStoragePlugin,
    allAssetTypePlugin,
  ];

  const client = new ApolloClient({
    uri: "/api/graphql",
    cache: new InMemoryCache(),
  });

  return (
    <AssetProvider
      signer={signer!}
      grapqlClient={client}
      storage={"ipfs"}
      plugins={plugins}
      account={account.address}
      requireLogin={() => openConnectModal?.()}
      assetHubManager={AssetHubManager}
    >
      {props.children}
    </AssetProvider>
  );
}

export function AppProvider(props: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AppAssetHubProvider>{props.children}</AppAssetHubProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
