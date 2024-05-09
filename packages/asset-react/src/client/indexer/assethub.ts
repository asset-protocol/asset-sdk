import { gql, useQuery } from "@apollo/client";
import { AssetHubInfo } from "../core";

export type GqlAssetHubList<T> = {
  assetHubs: T[],
}

const GET_Asset_HUBS = gql`
query GetAssetHubs($owner: String){
  assetHubs(where: {admin_eq: $owner}, limit:9999, orderBy: timestamp_ASC){
    id
    admin
    name
    nftGatedModule
    feeCollectModule
    tokenCollectModule
    timestamp
    version
    hash
  }
}`;

export function useGetAssetHubs(owner?: string, skipFunc?: (owner?: string) => boolean) {
  const { data, ...res } = useQuery<GqlAssetHubList<AssetHubInfo>>(GET_Asset_HUBS, {
    variables: { owner },
    skip: skipFunc?.(owner)
  });
  return { ...res, data: (data?.assetHubs) ?? [] };
}

const GET_HUB_BY_NAME_OR_ID = gql`
query GetAssetHubBy($nameOrId: String){
  assetHubs(where: {
    OR: [{id_eq: $nameOrId}, {name_eq: $nameOrId}]
  }, orderBy: timestamp_ASC){
    id
    admin
    name
    nftGatedModule
    feeCollectModule
    tokenCollectModule
    timestamp
    version
    hash
  }
}`;

export function useGetAssetHubByNameOrId(nameOrId?: string) {
  nameOrId = nameOrId || "";
  const { data, ...res } = useQuery<GqlAssetHubList<AssetHubInfo>>(GET_HUB_BY_NAME_OR_ID, {
    variables: {
      nameOrId: nameOrId
    },
    skip: !nameOrId
  });
  return { ...res, data: data?.assetHubs[0] };
}
