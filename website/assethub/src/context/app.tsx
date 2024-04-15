import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import {} from "@asset-protocol/react";

const queryClient = new QueryClient();
const config = getDefaultConfig({
  appName: "Asset Demo App",
  projectId: "17557b1e86e0cb2f1a007a122223ddbf",
  chains: [baseSepolia],
});

export function AppProvider(props: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{props.children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
