import { useCallback, useState } from "react";
import { useAssetHub } from "../context";
import { NewCuration } from "../client/assethub";
import { CurationAssetStruct } from "../client/assethub/abi/Curation";
import {
  AssetApprovalStatus,
  CurationStatus,
} from "../client/indexer/curation";

export type CreateCurationInput = {
  contentURI: string;
  status: CurationStatus;
  assets: CurationAssetStruct[];
  expiry: number;
};

export function useCreateCuration() {
  const { hubManagerInfo, contractRunner } = useAssetHub();
  const [loading, setLoading] = useState(false);

  const create = useCallback(
    async (args: CreateCurationInput) => {
      setLoading(true);
      try {
        if (hubManagerInfo && contractRunner) {
          const curation = NewCuration(contractRunner, hubManagerInfo.curation);
          console.log("creage args", args);
          let curationId: bigint | undefined;
          if (!contractRunner.isMulti) {
            curationId = await curation.create.staticCall(
              args.contentURI,
              args.status,
              args.expiry,
              args.assets
            );
          }
          const tx = await curation.create(
            args.contentURI,
            args.status,
            args.expiry,
            args.assets
          );
          await tx.wait();
          return curationId;
        }
      } finally {
        setLoading(false);
      }
    },
    [hubManagerInfo, contractRunner]
  );
  return { create, loading };
}

export function useCurationAddAssets() {
  const { hubManagerInfo, signer } = useAssetHub();
  const [loading, setLoading] = useState(false);

  const addAssets = useCallback(
    async (curationId: bigint, assets: CurationAssetStruct[]) => {
      if (assets.length === 0) {
        return;
      }
      setLoading(true);
      try {
        if (hubManagerInfo && signer) {
          const curation = NewCuration(signer, hubManagerInfo.curation);
          const tx = await curation.addAssets(curationId, assets);
          await tx.wait();
        }
      } finally {
        setLoading(false);
      }
    },
    [hubManagerInfo, signer]
  );
  return { addAssets, loading };
}

export function useCurationRemoveAssets() {
  const { hubManagerInfo, signer } = useAssetHub();
  const [loading, setLoading] = useState(false);

  const removeAssets = useCallback(
    async (curationId: bigint, assets: { hub: string; assetId: bigint }[]) => {
      setLoading(true);
      try {
        if (hubManagerInfo && signer) {
          const hubs = assets.map((a) => a.hub);
          const assetIds = assets.map((a) => a.assetId);
          if (hubs.length === 0) {
            return;
          }
          const curation = NewCuration(signer, hubManagerInfo.curation);
          const tx = await curation.removeAssets(curationId, hubs, assetIds);
          await tx.wait();
        }
      } finally {
        setLoading(false);
      }
    },
    [hubManagerInfo, signer]
  );
  return { removeAssets, loading };
}

export function useCurationApproveAssets() {
  const { hubManagerInfo, signer } = useAssetHub();
  const [loading, setLoading] = useState(false);

  const approveAssets = useCallback(
    async (
      curationId: bigint,
      assets: {
        hub: string;
        status: AssetApprovalStatus;
        assetId: bigint;
      }[]
    ) => {
      setLoading(true);
      try {
        if (hubManagerInfo && signer) {
          const statuses = assets.map((a) => a.status);
          const assetIds = assets.map((a) => a.assetId);
          const hubs = assets.map((a) => a.hub);
          if (assets.length === 0) {
            return;
          }
          const curation = NewCuration(signer, hubManagerInfo.curation);
          const tx = await curation.approveAssetBatch(
            curationId,
            hubs,
            assetIds,
            statuses
          );
          await tx.wait();
        }
      } finally {
        setLoading(false);
      }
    },
    [hubManagerInfo, signer]
  );
  return { approveAssets, loading };
}
