import { ApolloClient, InMemoryCache } from "@apollo/client";
import {
  AssetProvider,
  allAssetTypePlugin,
  arwaveStoragePlugin,
  ipfsPinataPlugin,
} from "@asset-protocol/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEthersSigner } from "../context/ether";
import { useAccount } from "wagmi";
import { useMemo } from "react";
import { FeeCollectModule } from "./plugins/FeeCollectModule";
import { TokenCollectModule } from "./plugins/TokenCollectModule";

const JWTOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkMjFmMjUzMi01ODMxLTRmZTgtODAwMi01ODkxMjA2MjE4MjMiLCJlbWFpbCI6IndhaXRlMXhAb3V0bG9vay5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiN2E0OWNiM2Q2OTM3NTQ4YzMzMjEiLCJzY29wZWRLZXlTZWNyZXQiOiJkNWYxZWY2NDkyMWMwMTc2YzYyNTkyYTNhNTZkMzc3MmVlYWY3NmIwZjFkZGE4Y2RhYmY1NzA2NGYyYjQ3OTYxIiwiaWF0IjoxNzEwNDg0MjIxfQ.sQp8EB2l716fjOqG8Uj2n4zitR1wBQ3-IsiKlZ6XVOo";

export function AssetHub(props: { children: React.ReactNode }) {
  const signer = useEthersSigner();
  const currentAccount = useAccount();
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

  const account = useMemo(
    () =>
      currentAccount.address && {
        address: currentAccount.address,
      },
    [currentAccount]
  );

  return (
    <AssetProvider
      signer={signer!}
      grapqlClient={client}
      storage={"ipfs"}
      plugins={plugins}
      account={account}
      requireLogin={() => openConnectModal?.()}
    >
      <FeeCollectModule />
      <TokenCollectModule />

      {props.children}
    </AssetProvider>
  );
}
