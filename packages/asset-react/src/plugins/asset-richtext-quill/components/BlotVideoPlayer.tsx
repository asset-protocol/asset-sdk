import { ReactPlayerProps } from "react-player";
import { VideoPlayer } from "../../../components/VideoPlayer/VideoPalyer";

export type BlotVideoPlayerProps = Pick<ReactPlayerProps, "url">;
export function BlotVideoPlayer(props: BlotVideoPlayerProps) {
  return (
    <div>
      <VideoPlayer
        {...props}
        fallback={<div className="w-full h-full bg-gray-300"></div>}
        controls
      ></VideoPlayer>
    </div>
  );
}
