import ReactPlayer from "react-player";
import { VideoNode, VideoPayload } from "./VideoNode";
import { Button } from "antd";
import { useEffect, useRef, useState } from "react";
import {
  $getNodeByKey,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  NodeKey,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
export type InsertVideoPayload = Readonly<VideoPayload>;

export type VideoComponentProps = Omit<VideoPayload, "key"> & {
  nodeKey: NodeKey;
  readonly?: boolean;
};
export function VideoComponent(props: VideoComponentProps) {
  const { readonly, nodeKey } = props;
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected] = useLexicalNodeSelection(nodeKey);
  const playerRef = useRef<ReactPlayer>(null);
  const [width, setWidth] = useState(props.width);
  const [aspectRatio, setAspectRatio] = useState(props.aspectRatio);
  const onWidthChange = (value?: number | string) => {
    editor.update(() => {
      $getNodeByKey<VideoNode>(nodeKey)?.setWidth(value);
    });
    setWidth(value);
  };

  const onAspectRatioChange = (ar?: string) => {
    editor.update(() => {
      $getNodeByKey<VideoNode>(nodeKey)?.setAspectRatio(ar);
    });
    setAspectRatio(ar);
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (e) => {
          if (e.target === playerRef.current?.getInternalPlayer()) {
            setSelected(true);
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, setSelected]);

  return (
    <div
      style={{ width: width ?? "100%", aspectRatio, display: "inline-block" }}
    >
      <ReactPlayer
        ref={playerRef}
        url={props.src}
        width="100%"
        height="100%"
        fallback={<div className="w-full h-full bg-gray-300"></div>}
        controls
      ></ReactPlayer>
      {readonly !== true && isSelected && (
        <VideoSetter
          width={width}
          onWidthChange={onWidthChange}
          aspectRatio={aspectRatio}
          onAspectRatioChange={onAspectRatioChange}
        />
      )}
    </div>
  );
}

function VideoSetter({
  width,
  onWidthChange,
  aspectRatio,
  onAspectRatioChange,
}: {
  width?: string | number;
  aspectRatio?: string;
  onWidthChange: (value?: number | string) => void;
  onAspectRatioChange: (ar?: string) => void;
}) {
  const options = ["auto", "25%", "50%", "75%", "100%"];
  return (
    <div className="flex gap-2 px-2 py-2 rounded-sm drop-shadow-sm bg-gray-100 items-center">
      {options.map((v) => {
        return (
          <Button
            type={v === width ? "primary" : "default"}
            size="small"
            key={v}
            onClick={() => {
              onWidthChange?.(v);
            }}
          >
            {v}
          </Button>
        );
      })}
      <Button
        type={aspectRatio === "16/9" ? "primary" : "default"}
        onClick={() => onAspectRatioChange("16/9")}
      >
        16:9
      </Button>
      <Button
        type={aspectRatio === undefined ? "primary" : "default"}
        onClick={() => onAspectRatioChange(undefined)}
      >
        auto
      </Button>
    </div>
  );
}
