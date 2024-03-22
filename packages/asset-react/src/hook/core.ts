import { Asset } from "../client/core";
import { useAssetHub } from "../context";
import { ASSET_TYPE_UNKNOW, Info } from "../core";
import { useEffect, useState } from "react";

export function useEditorProvider() {
  const { ctx } = useAssetHub();
  return (type: string) => {
    let p = ctx.editorProviders[type]?.find(p => p.selector(type));
    if (!p) {
      p = ctx.editorProviders[ASSET_TYPE_UNKNOW]?.find(p => p.selector(type));
      if (!p) {
        throw new Error("editor provider no found: " + type);
      }
    }
    return p
  }
}

export function useViewer() {
  const { ctx } = useAssetHub();
  return (asset: Asset) => {
    let p = ctx.viewerProviders[asset.type]?.find(p => p.selector(asset));
    if (!p) {
      p = ctx.viewerProviders[ASSET_TYPE_UNKNOW]?.find(p => p.selector(asset));
      if (!p) {
        throw new Error("viewer provider no found: " + asset.type);
      }
    }
    return p
  }
}

export function useAssetTypes() {
  const { ctx } = useAssetHub();
  return () => {
    const types = new Map<string, Info>();
    Object.values(ctx.editorProviders).forEach(v => {
      v.forEach(p => {
        p.types.forEach(t => {
          types.set(t.value, t);
        });
      });
    });
    types.delete(ASSET_TYPE_UNKNOW);
    return Array.from(types.values());
  }
}

export function useCurrentAsscount() {
  const { signer } = useAssetHub();
  const [account, setAccount] = useState<string>();
  useEffect(() => {
    signer?.getAddress().then(setAccount);
  }, [signer])

  return account
}



