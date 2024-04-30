import { useAssetHub } from "../context";
import { globalConfig } from "../core";

export function useReplaceUri() {
  const { ctx } = useAssetHub();
  return (uri?: string) => {
    if (!uri) return uri;
    if (typeof uri !== "string") return uri;
    const paths = uri.split("://");
    if (paths.length > 1 && paths[0].length < 16) {
      const storage = ctx.storages[paths[0]];
      if (storage) {
        return storage.getUrl(uri);
      }
    }
    return uri;
  }
}

export function replaceUri(uri?: string) {
  if (!uri) return uri;
  if (typeof uri !== "string") return uri;
  const paths = uri.split("://");
  if (paths.length > 1 && paths[0].length < 16) {
    const storage = globalConfig.storages[paths[0]];
    if (storage) {
      return storage.getUrl(uri);
    }
  }
  return uri;
}