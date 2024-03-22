import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";

export type AssetCollector = {
  id: string;
  collector: string;
  tokenId: string;
  collectModule: string;
  timestamp: string;
}

const COLLECTORS = gql`
query GetCollectors($hub:String!, $assetId: BigInt!, $collector: String) {
  collectorsConnection(
    where: {
      collector_eq: $collector, 
      asset: {
        assetId_eq: $assetId, hub_eq: $hub
    }},
    orderBy: timestamp_DESC
  ) {
    edges {
      node {
        id
        tokenId
        collector
        collectModule
        timestamp
      }
    }
  }
}
`
type GqlCollectorList = {
  collectorsConnection: {
    edges: { node: AssetCollector }[],
    pageInfo: {
      hasNextPage: boolean,
      hasPreviousPage: boolean,
      startCursor: string
      endCursor: string
    }
  }
}

export function useGetAssetCollectors(hub?: string, assetId?: string, collector?: string) {
  const { data, ...res } = useQuery<GqlCollectorList>(COLLECTORS, {
    variables: {
      hub, assetId, collector
    },
    fetchPolicy: "no-cache",
    skip: !hub || !assetId
  })
  const resData = useMemo(() => ({
    collectors: data?.collectorsConnection.edges.map(e => e.node) || [],
    pageInfo: data?.collectorsConnection.pageInfo
  }), [data])
  return { ...res, data: resData }
}