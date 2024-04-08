import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";

const GET_HUB_MANAGER = gql`
query GetHubManager {
  hubManagers {
    globalModule
    id
    timestamp
  }
}
`

export type AssetHubManagerInfo = {
  id: string;
  globalModule: string;
  timestamp: string;
}

export function useGetHubManager() {
  const { data, ...res } = useQuery<{ hubManagers: AssetHubManagerInfo[] }>(GET_HUB_MANAGER);

  const manager = useMemo(() => {
    return data?.hubManagers[0];
  }, [data])
  return { data: manager, ...res }
}