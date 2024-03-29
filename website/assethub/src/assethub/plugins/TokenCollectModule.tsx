import { TokenCollectModulePlugin, useAssetHub } from "@asset-protocol/react";
import { useEffect } from "react";

export function TokenCollectModule() {
  const { ctx, hubInfo } = useAssetHub();

  useEffect(() => {
    if (hubInfo?.tokenCollectModule) {
      ctx.use(
        TokenCollectModulePlugin({
          moduleContract: hubInfo.tokenCollectModule,
          tokens: [
            {
              label: "TestToken",
              name: "TST",
              contract: "0xc2ADF187D9B064F68FcD8183195cddDB33E10E8F",
            },
          ],
        })
      );
    }
  }, [ctx, hubInfo]);

  return null;
}
