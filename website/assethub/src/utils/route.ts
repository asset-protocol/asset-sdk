/* eslint-disable react-hooks/exhaustive-deps */
import { useAssetHub } from "@asset-protocol/react";
import { useCallback } from "react";
import { NavigateOptions, useNavigate } from "react-router-dom";

export function useGoHome() {
  const { hubInfo } = useAssetHub();
  const navigate = useNavigate();
  return useCallback(() => {
    navigate(`/${hubInfo?.name ?? "home"}`)
  }, [hubInfo])
}

export function useNavigateAssetHub() {
  const { hubInfo } = useAssetHub();
  const navigate = useNavigate();
  return useCallback((to: string, opts?: NavigateOptions) => {
    if (to.startsWith("/")) {
      navigate(`/${hubInfo?.name}${to}`, opts)
    } else {
      navigate(`/${hubInfo?.name}/${to}`, opts)
    }
  }, [hubInfo])
}

export function useGoAsset() {
  const navigate = useNavigate();
  const goAssets = () => {
    navigate("/assets")
  }
  const goViewer = (hub: string, assetId: string) => {
    navigate(`/${hub}/asset/${assetId}`)
  }
  const goCreate = (hub: string) => {
    navigate(`/${hub}/asset/create`)
  }
  return {
    goViewer, goCreate, goAssets
  }
}

export function useGoCuration() {
  const navigate = useNavigate();
  const goCurations = () => {
    navigate("/curations")
  }
  const goCreate = () => {
    navigate(`/curations?create=true`)
  }

  const goCuration = (curationId: string) => {
    navigate(`/curations/${curationId}`)
  }

  return {
    goCurations, goCreate, goCuration
  }
}

export function useGoCreator() {
  const navigate = useNavigate();
  const goCreator = () => {
    navigate("/creator")
  }

  return { goCreator }
}