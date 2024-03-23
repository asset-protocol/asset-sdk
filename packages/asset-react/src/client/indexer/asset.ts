
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
          type
          name
          image
          description
          tags
          publisher
          contentUri
          timestamp
          hash
          collectModule
          collectModuleInitData
          collectNft
          collectCount
          gatedModule
          gatedModuleInitData
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
  hub: string,
  publisher?: string,
  assetId?: string,
  first?: number,
  after?: string,
  orderBy?: AssetsOrderBy[]
  fetchPolicy?: WatchQueryFetchPolicy
}

const defaultInput: GetAssetHubAssetsInput = {
  hub: "",
  orderBy: ["timestamp_DESC"]
}

export function useGetHubAssets(args: GetAssetHubAssetsInput) {
  const { data, ...res } = useQuery<GqlAssetList<Asset>>(GET_HUb_ASSETS, {
    variables: { ...defaultInput, ...args, hub: args.hub },
    fetchPolicy: args.fetchPolicy,
    skip: !args.hub
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
  return useGetHubAssets({
    hub: hub,
    publisher: publisher
  })
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
          type
          name
          image
          description
          content
          tags
          publisher
          contentUri
          timestamp
          metadata
          hash
          collectModule
          collectModuleInitData
          collectNft
          collectCount
          gatedModule
          gatedModuleInitData
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
