import { TokenCollectModulePlugin, useAssetHub } from "@asset-protocol/react";
import { useEffect } from "react";

export function TokenCollectModule() {
  const { ctx, hubInfo } = useAssetHub();

  useEffect(() => {
    if (hubInfo?.tokenCollectModule) {
      return ctx.use(
        TokenCollectModulePlugin({
          moduleContract: hubInfo.tokenCollectModule,
          tokens: [
            {
              label: "TestToken",
              name: "TST",
              contract: "0x36536674237634Dd5e1F4C32804567F611e88602",
            },
          ],
        })
      );
    }
  }, [ctx, hubInfo]);

  return null;
}
