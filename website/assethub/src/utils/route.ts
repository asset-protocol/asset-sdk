/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useGoHome() {
  const navigate = useNavigate();
  return useCallback(() => {
    navigate(`/home`)
  }, [])
}

export function useGoHub() {
  const navigate = useNavigate();
  const goHub = (hub: string) => {
    navigate(`/${hub}`)
  }
  return { goHub }
}

export function useGoAsset() {
  const navigate = useNavigate();
  const goAssets = useCallback(() => {
    navigate("/assets")
  }, [])
  const goViewer = useCallback((hub: string, assetId: string) => {
    navigate(`/${hub}/asset/${assetId}`)
  }, [])
  const goCreate = useCallback(() => {
    navigate(`/assets/create`)
  }, [])
  const goEdit = useCallback((hub: string, assetId: string) => {
    navigate(`/${hub}/asset/${assetId}/edit`)
  }, [])
  return {
    goViewer, goCreate, goAssets, goEdit
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