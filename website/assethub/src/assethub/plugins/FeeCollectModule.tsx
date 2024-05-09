import { FeeCollectModulePlugin, useAssetHub } from "@asset-protocol/react";
import { useEffect } from "react";

export function FeeCollectModule({
  feeCollectModule,
}: {
  feeCollectModule: string;
}) {
  const { ctx } = useAssetHub();

  useEffect(() => {
    if (feeCollectModule) {
      return ctx.use(FeeCollectModulePlugin(feeCollectModule));
    }
  }, [ctx, feeCollectModule]);

  return null;
}
