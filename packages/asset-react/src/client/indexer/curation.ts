import { gql, useQuery } from "@apollo/client";
import { Asset } from "../core";

export enum CurationStatus {
  Private = 0,
  Public = 1,
}

export type AssetApprovalStatus = "Pending" | "Approved" | "Rejected";
export enum AssetApprovalStatusType {
  Pending = 0,
  Approved = 1,
  Rejected = 2
}

export type Curation = {
  id: string;
  name: string;
  description: string;
  image: string;
  status: CurationStatus;
  publisher: string;
  tokenURI: string;
  timestamp: number;
  lastUpdatedAt: number;
  hash: string;
  assets: { asset: Asset, status: AssetApprovalStatus, order: number }[];
}
export type GqlCurationList<T> = {
  curationsConnection: {
    edges: { node: T }[],
    pageInfo: {
      hasNextPage: boolean,
      hasPreviousPage: boolean,
      startCursor: string
      endCursor: string
    }
  }
}

const GET_CURATIONS = gql`
query GetCurations{
  curationsConnection(orderBy: timestamp_DESC) {
    edges {
      node {
        id
        status
        image
        hash
        description
        lastUpdatedAt
        name
        publisher
        timestamp
        tokenURI
        assets(limit: 10) {
          order
          status
          asset {
            name
            publisher
            type
            timestamp
            description
            assetId
            id
            image
            hub
            hubName
          }
        }
      }
    }
  }
}`;

export function useGetCurations() {
  const { data, ...res } = useQuery<GqlCurationList<Curation>>(GET_CURATIONS, {
    fetchPolicy: "no-cache",
  });
  return { ...res, data: data?.curationsConnection.edges.map(edge => edge.node) };
}

const GET_CURATION_BY_ID = gql`
query GetCurationById($id: String!) {
  curationById(id: $id) {
    id
    name
    image
    description
    lastUpdatedAt
    metadata
    publisher
    tokenURI
    timestamp
    assets {
      order
      status
      asset {
        id
        image
        name
        description
        timestamp
        type
        lastUpdatedAt
        publisher
        hub
        hubName
        assetId
        collectCount
        tags {
          name
        }
        metadata
      }
    }
  }
}`;

export function useGetCurationById(id: string) {
  const { data, ...res } = useQuery<{ curationById: Curation | null }>(GET_CURATION_BY_ID, {
    variables: { id },
    fetchPolicy: "no-cache",
    skip: !id,
  });
  if (data?.curationById?.assets) {
    data.curationById.assets = data.curationById.assets.sort((a, b) => a.order - b.order);
  }
  return { ...res, data: data?.curationById };
}

const GET_CURATION_ASSETS = gql`
query GetCurationAssets($publisher: String, $status: AssetApproveStatus) {
  curations(where: {assets_some: {asset: {publisher_eq: $publisher}, status_eq: $status}}) {
    assets(where: {status_eq: $status, asset: {publisher_eq: $publisher}}) {
      asset {
        id
        assetId
        type
        hub
        hubName
        name
        description
        image
      }
      approveAt
      status
      timestamp
      order
    }
    name
    description
    image
    id
    publisher
    timestamp
  }
}`;

export function useGetCurationAssets(publisher: string, status?: AssetApprovalStatus) {
  const { data, ...res } = useQuery<{ curations: Curation[] }>(GET_CURATION_ASSETS, {
    variables: { publisher, status },
    fetchPolicy: "no-cache",
    skip: !publisher,
  });
  return { ...res, data: data?.curations };
}

const GET_CURATION_TAG_NAMES = gql`
query GetAssetTagNames($keyword: String, $limit: Int){
  assetTagNames(keyword: $keyword, limit: $limit) {
    name
    count
  }
}
`;
export function useGetCurationTagNames(keyword?: string, limit?: number) {
  const { data, ...res } = useQuery<{ curationTagNames: { name: string, count: number }[] }>(GET_CURATION_TAG_NAMES, {
    variables: { keyword, limit },
    fetchPolicy: "no-cache",
  })
  return { ...res, data: data?.curationTagNames }
}