import { useAssetHub } from "../context/provider";
import { DataTypes, NewTokenGlobalModule } from '../client/assethub';
import { BytesLike, ZeroAddress } from 'ethers';
import { useCallback, useEffect, useState } from "react";
import { HubCreateDataStruct } from "../client/assethub/abi/LiteAssetHubManager";
import { INGORED_ADDRESS, ZERO_BYTES } from "../core";
import { PayableOverrides } from "../client/assethub/abi";
import { HubTokenFeeConfigStructOutput } from "../client/assethub/abi/TokenGlobalModule";

export function useDeployNewAssetHub() {
  const { assetHubManager } = useAssetHub();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<string>();
  const zeroAssetHubCreateData: Partial<HubCreateDataStruct> = {
    admin: ZeroAddress,
    name: "",
    createModule: ZeroAddress,
  }
  const deploy = async (data: HubCreateDataStruct) => {
    if (!assetHubManager) {
      throw new Error("AssetHubManager not found");
    }
    setIsLoading(true);
    try {
      if (!data.name) {
        throw new Error("name is required");
      }
      const createData = {
        ...zeroAssetHubCreateData,
        ...data,
      };
      const hub = await assetHubManager.deploy.staticCall(createData);
      const res = await assetHubManager.deploy(createData);
      await res.wait();
      console.log("asset hub created: ", hub);
      setData(hub);
    } finally {
      setIsLoading(false);
    }
  }
  return { deploy, data, isLoading };
}

export type AssetCreateData = Partial<DataTypes.AssetCreateDataStruct>;

function checkCreateData(data: AssetCreateData): DataTypes.AssetCreateDataStruct {
  data.publisher = data.publisher || ZeroAddress;
  data.contentURI = data.contentURI || "";
  data.assetCreateModuleData = data.assetCreateModuleData || ZERO_BYTES;
  data.collectModule = data.collectModule || ZeroAddress;
  data.collectModuleInitData = data.collectModuleInitData || ZERO_BYTES;
  data.gatedModule = data.gatedModule || ZeroAddress;
  data.gatedModuleInitData = data.gatedModuleInitData || ZERO_BYTES;
  return data as DataTypes.AssetCreateDataStruct;
}

export function useCreateAsset() {
  const { assetHub } = useAssetHub();
  const [isLoading, setIsLoading] = useState(false);
  const create = useCallback(async (data: AssetCreateData) => {
    if (!assetHub) {
      throw new Error("asset hub not set");
    }
    setIsLoading(true);
    const createData = checkCreateData(data);
    console.log("createData", createData)
    try {
      const tokenId = await assetHub.create.staticCall(createData);
      const res = await assetHub.create(createData);
      await res.wait();
      return tokenId;
    } finally {
      setIsLoading(false);
    }
  }, [assetHub])
  return { create, isLoading };
}

export type UpdateAssetInput = Partial<DataTypes.AssetUpdateDataStruct>;

function checkUpdateData(data: UpdateAssetInput): DataTypes.AssetUpdateDataStruct {
  data.collectModule = data.collectModule || INGORED_ADDRESS;
  data.collectModuleInitData = data.collectModuleInitData || ZERO_BYTES;
  data.gatedModule = data.gatedModule || INGORED_ADDRESS;
  data.gatedModuleInitData = data.gatedModuleInitData || ZERO_BYTES;
  data.contentURI = data.contentURI || "";
  return data as DataTypes.AssetUpdateDataStruct;
}

export function useUpdateAsset() {
  const { assetHub } = useAssetHub();
  const [isLoading, setIsLoading] = useState(false);

  const update = async (assetId: bigint, data: UpdateAssetInput) => {
    if (!assetHub) {
      throw new Error("asset hub not set");
    }
    setIsLoading(true);
    try {
      const updateData = checkUpdateData(data);
      console.log("updatedata", updateData);
      console.log("assetId", assetId);
      const res = await assetHub.update(assetId, updateData);
      await res.wait();
    } finally {
      setIsLoading(false);
    }
  }
  return { update, isLoading };
}


export type CollectData = {
  collectData: BytesLike;
}

export function useCollectAsset() {
  const { assetHub, hubInfo } = useAssetHub();
  const [isLoading, setIsLoading] = useState(false);
  const collect = async (assetId: bigint, collectData: CollectData, options?: PayableOverrides) => {
    if (!assetHub || !hubInfo) {
      throw new Error("asset hub not set");
    }
    setIsLoading(true);
    try {
      const tokeNftId = await assetHub.collect.staticCall(assetId, collectData.collectData, options ?? {});
      console.log("tokeNftId", tokeNftId)
      const res = await assetHub.collect(assetId, collectData.collectData, options ?? {});
      await res.wait();
      return tokeNftId;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } finally {
      setIsLoading(false);
    }
  }
  return { collect, isLoading };
}

export function useGetHubGlobalModuleConfig() {
  const { hubManagerInfo, hubInfo, signer } = useAssetHub();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<HubTokenFeeConfigStructOutput>();

  useEffect(() => {
    getConfig().then((res) => {
      setConfig(res);
    })
  }, []);

  const getConfig = async () => {
    if (!hubManagerInfo || !hubInfo) {
      return;
    }
    if (hubManagerInfo.globalModule === ZeroAddress) {
      return;
    }
    try {
      setLoading(true);
      const module = NewTokenGlobalModule(signer, hubManagerInfo.globalModule);
      const res = await module.config(hubInfo.id);
      console.log("config", res);
      return res;
    } finally {
      setLoading(false);
    }
  }
  return { config, loading }
}