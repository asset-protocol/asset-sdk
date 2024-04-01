import { FeeCollectModulePlugin, useAssetHub } from "@asset-protocol/react";
import { useEffect } from "react";

export function FeeCollectModule() {
  const { ctx, hubInfo } = useAssetHub();

  useEffect(() => {
    if (hubInfo?.feeCollectModule) {
      ctx.use(FeeCollectModulePlugin(hubInfo.feeCollectModule));
    }
  }, [ctx, hubInfo]);

  return null;
}
