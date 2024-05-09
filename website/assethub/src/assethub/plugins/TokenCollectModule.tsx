import { TokenCollectModulePlugin, useAssetHub } from "@asset-protocol/react";
import { useEffect } from "react";

export function TokenCollectModule({
  tokenCollectModule,
}: {
  tokenCollectModule: string;
}) {
  const { ctx } = useAssetHub();

  useEffect(() => {
    if (tokenCollectModule) {
      return ctx.use(
        TokenCollectModulePlugin({
          moduleContract: tokenCollectModule,
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
  }, [ctx, tokenCollectModule]);

  return null;
}
