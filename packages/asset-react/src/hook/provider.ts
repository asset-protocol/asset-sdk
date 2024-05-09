import { useAssetHub } from "../context";
import { useGetAssetHubs } from "../client/indexer";

export function useUserHubs() {
  const { account } = useAssetHub();
  return useGetAssetHubs(account?.address, a => !a);
}