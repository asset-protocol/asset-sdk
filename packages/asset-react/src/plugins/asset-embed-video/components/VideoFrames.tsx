import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'

function toBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>(resolve => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob)
      }
    })
  })
}

export type VideoFramesProps = {
  url: string
  currentTime?: number
  onFrames?: (frames: Blob[]) => void
  loadingChange?: (loading: boolean) => void
}

export function VideoFrames(props: VideoFramesProps) {
  const videoRef = useRef<ReactPlayer>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  let c = 0
  const fetchFrames = () => {
    if (!videoRef.current) {
      return
    }
    props.loadingChange?.(true)
    const video = videoRef.current.getInternalPlayer() as HTMLVideoElement
    if (!video) {
      return
    }
    video.muted = true
    video.currentTime = props.currentTime ?? 0

    const canvas = document.createElement('canvas')
    const frames: Blob[] = []
    const drawingLoop = async (_: any, meta: any) => {
      if (frames.length !== 0 && meta.presentedFrames % 10 !== 0) {
        video.requestVideoFrameCallback(drawingLoop)
        return
      }
      const bitmap = await createImageBitmap(video)
      canvas.height = bitmap.height
      canvas.width = bitmap.width
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(bitmap, 0, 0)
      const blob = await toBlob(canvas)
      frames.push(blob)
      if (c < 4) {
        c++
        video.requestVideoFrameCallback(drawingLoop)
      } else {
        props.onFrames?.(frames)
        props.loadingChange?.(false)
        video.pause()
      }
    }
    video.requestVideoFrameCallback(drawingLoop)
    video
      .play()
      .then(() => {})
      .catch(() => {
        props.loadingChange?.(false)
        c = 0
      })
  }

  useEffect(() => {
    if (isLoaded) {
      fetchFrames()
    }
  }, [props.currentTime, props.url, isLoaded])
  return (
    <ReactPlayer
      ref={videoRef}
      url={props.url}
      onReady={() => setIsLoaded(true)}
      config={{ file: { attributes: { onLoad: fetchFrames } } }}
      style={{ display: 'none' }}
    />
  )
}
