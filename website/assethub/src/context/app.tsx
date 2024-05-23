import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { rainbowWallet, safeWallet, metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { } from "@asset-protocol/react";
import { ConfigProvider, ConfigProviderProps } from "antd";

const queryClient = new QueryClient();
const config = getDefaultConfig({
  appName: "Asset Demo App",
  projectId: "17557b1e86e0cb2f1a007a122223ddbf",
  chains: [baseSepolia],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [rainbowWallet, safeWallet, metaMaskWallet, walletConnectWallet],
    },
  ]
});

const antConfig: ConfigProviderProps = {
  theme: {
    components: {
      Layout: {
        headerBg: "transparent",
      },
    },
  },
};

export function AppProvider(props: { children: React.ReactNode }) {
  return (
    <ConfigProvider {...antConfig}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{props.children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ConfigProvider>
  );
}
