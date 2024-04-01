import { useAssetHub } from "../context";
import { StorageScheme } from "../core";

export function useStorage(schema: StorageScheme) {
  const { ctx } = useAssetHub();
  const tp = ctx.storages[schema];
  if (!tp) {
    throw new Error(`Storage scheme ${schema} not found`);
  }
  return tp;
}