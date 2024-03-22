import ReactPlayer, { ReactPlayerProps } from "react-player";

export function VideoPlayer(props: ReactPlayerProps) {
  return (
    <ReactPlayer
      {...props}
      width="100%"
      height="100%"
      fallback={<div className="w-full h-full bg-gray-300"></div>}
    ></ReactPlayer>
  );
}
