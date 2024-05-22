
import { WatchQueryFetchPolicy, gql, useApolloClient, useQuery } from '@apollo/client'
import { Asset } from '../core'
import { useMemo, useState } from 'react'
import { ASSET_FIELDS } from './fragments'

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

const GET_HUb_ASSETS = (tags?: string[]) => gql`
${ASSET_FIELDS}
query GetAssets($hub: String, $publisher: String, $assetId: BigInt${tags?.length ? ", $tags: [String!]" : ""}, $first: Int, $after: String, $orderBy: [AssetOrderByInput!]!){
  assetsConnection(
    first: $first,
    after: $after,
    orderBy: $orderBy,
    where: { hub_eq: $hub, publisher_eq: $publisher, assetId_eq: $assetId${tags?.length ? ", tags_some: {normalizedName_in: $tags}" : ""} }){
      edges {
        node {
          ...AssetFields
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
  tags?: string[],
  first?: number,
  after?: string,
  orderBy?: AssetsOrderBy[]
  fetchPolicy?: WatchQueryFetchPolicy
  skipFunc?: (args: GetAssetHubAssetsInput) => boolean
}

const defaultInput: GetAssetHubAssetsInput = {
  orderBy: ["timestamp_DESC"]
}

export function useGetAssets(args?: GetAssetHubAssetsInput) {
  const gqlText = useMemo(() => GET_HUb_ASSETS(args?.tags), [args])
  const { data, ...res } = useQuery<GqlAssetList<Asset>>(gqlText, {
    variables: { ...defaultInput, ...args },
    fetchPolicy: args?.fetchPolicy,
    skip: args?.skipFunc?.(args)
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
${ASSET_FIELDS}
query GetAssets($hub: String, $publisher: String, $assetId: BigInt, $first: Int, $after: String, $orderBy: [AssetOrderByInput!]!){
  assetsConnection(
    first: $first,
    after: $after,
    orderBy: $orderBy,
    where: { hub_eq: $hub, publisher_eq: $publisher, assetId_eq: $assetId }){
      edges {
        node {
          content
          metadata
          ...AssetFields
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
  return { ...res, asset: data?.assetsConnection.edges?.[0]?.node }
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

const GET_ASSET_TAG_NAMES = gql`
query GetAssetTagNames($keyword: String, $limit: Float){
  assetTagNames(keyword: $keyword, limit: $limit) {
    name
    count
  }
}
`;
export function useGetAssetTagNames(keyword?: string, limit?: number) {
  const { data, ...res } = useQuery<{ assetTagNames: { name: string, count: number }[] }>(GET_ASSET_TAG_NAMES, {
    variables: { keyword, limit },
    fetchPolicy: "no-cache",
  })
  return { ...res, data: data?.assetTagNames }
}