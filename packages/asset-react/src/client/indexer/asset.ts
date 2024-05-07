
import { WatchQueryFetchPolicy, gql, useApolloClient, useQuery } from '@apollo/client'
import { Asset } from '../core'
import { useMemo, useState } from 'react'

export type GqlAssetList<T> = {
  assetsConnection: {
    edges: { node: T }[],
    pageInfo: {
      hasNextPage: boolean,
      hasPreviousPage: boolean,
      startCursor: string
      endCursor: string
    }
  }
}

const GET_HUb_ASSETS = gql`
query GetAssets($hub: String, $publisher: String, $assetId: BigInt, $first: Int, $after: String, $orderBy: [AssetOrderByInput!]!){
  assetsConnection(
    first: $first,
    after: $after,
    orderBy: $orderBy,
    where: { hub_eq: $hub, publisher_eq: $publisher, assetId_eq: $assetId }){
      edges {
        node {
          assetId
          hub
          type
          name
          image
          description
          tags {
            name
          }
          publisher
          contentUri
          timestamp
          lastUpdatedAt
          hash
          collectModule
          collectModuleInitData
          collectNft
          collectCount
          gatedModule
          gatedModuleInitData
          query1
          query2
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
}
`;

export type AssetsOrderBy = "timestamp_ASC" | "timestamp_DESC" | "collectCount_ASC" | "collectCount_DESC" | 'type_DESC' | "type_ASC";

export type GetAssetHubAssetsInput = {
  hub?: string,
  publisher?: string,
  assetId?: string,
  first?: number,
  after?: string,
  orderBy?: AssetsOrderBy[]
  fetchPolicy?: WatchQueryFetchPolicy
  skipFunc?: (args: GetAssetHubAssetsInput) => boolean
}

const defaultInput: GetAssetHubAssetsInput = {
  orderBy: ["timestamp_DESC"]
}

export function useGetAssets(args: GetAssetHubAssetsInput) {
  const { data, ...res } = useQuery<GqlAssetList<Asset>>(GET_HUb_ASSETS, {
    variables: { ...defaultInput, ...args, hub: args.hub },
    fetchPolicy: args.fetchPolicy,
    skip: args.skipFunc?.(args)
  })
  const newData = useMemo(() => ({
    assets: data?.assetsConnection.edges.map(a => {
      return a.node;
    }),
    pageInfo: data?.assetsConnection.pageInfo
  }), [data])
  return { ...res, data: newData }
}

export function useGetAssetsByWallet(publisher: string, hub: string) {
  return useGetAssets({
    hub: hub,
    publisher: publisher
  })
}

const SEARCH_ASSETS = gql`
query SearchAssets($query: String!){
  assets(where: {name_containsInsensitive: $query}){
    id
    assetId
    hub
    type
    name
    image
    description
    tags {
      name
    }
    publisher
    timestamp
    hash
  }
}
`
export function useSearchAssets(keyword: string) {
  const { data, ...res } = useQuery<{ assets: Asset[] }>(SEARCH_ASSETS, {
    variables: { query: keyword },
    fetchPolicy: "no-cache",
    skip: !keyword
  })
  return { ...res, data: data?.assets }
}


const GET_HUb_ASSETS_BY_ID = gql`
query GetAssets($hub: String, $publisher: String, $assetId: BigInt, $first: Int, $after: String, $orderBy: [AssetOrderByInput!]!){
  assetsConnection(
    first: $first,
    after: $after,
    orderBy: $orderBy,
    where: { hub_eq: $hub, publisher_eq: $publisher, assetId_eq: $assetId }){
      edges {
        node {
          assetId
          hub
          type
          name
          image
          description
          content
          tags{
            name
          }
          publisher
          contentUri
          timestamp
          lastUpdatedAt
          metadata
          hash
          collectModule
          collectModuleInitData
          collectNft
          collectCount
          gatedModule
          gatedModuleInitData
          query1
          query2
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
}
`;

export function useGetAssetById(assetId: bigint, hub: string) {
  const tokenId = assetId.toString();
  const { data, ...res } = useQuery<GqlAssetList<Asset>>(GET_HUb_ASSETS_BY_ID, {
    variables: { assetId: tokenId, hub: hub, orderBy: "timestamp_DESC" },
    fetchPolicy: "no-cache",
    skip: !hub
  })
  return { ...res, asset: data?.assetsConnection.edges?.[0].node }
}

const REFRESH_ASSET_METADATA = gql`
query RefreshMetatData($assetId:String!, $hub:String!){
  refreshMetatData(assetId: $assetId, hub: $hub)
}
`
export function useRefreshAssetMetadata() {
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);

  const refresh = async (assetId: bigint, hub: string) => {
    try {
      setLoading(true)
      const res = await client.query<{ refreshMetatData: boolean }>({
        query: REFRESH_ASSET_METADATA,
        variables: { assetId: assetId.toString(), hub },
        fetchPolicy: "no-cache"
      });
      return res.data.refreshMetatData;
    } finally {
      setLoading(false);
    }
  }
  return { refresh, loading }
}
