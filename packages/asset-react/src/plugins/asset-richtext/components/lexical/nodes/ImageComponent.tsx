/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalCommand, LexicalEditor, NodeKey } from "lexical";

import "./ImageNode.css";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import {
  $getNodeByKey,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  createCommand,
} from "lexical";
import {
  MouseEvent,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { WidthSetter } from "../ui/WidthSetter";
import { ImageNode } from "./ImageNode";
import { mergeRegister } from "@lexical/utils";

const imageCache = new Set();

export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> =
  createCommand("RIGHT_CLICK_IMAGE_COMMAND");

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}

function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
}: {
  altText: string;
  className: string | null;
  height: string | number;
  imageRef: { current: null | HTMLImageElement };
  src: string;
  width: string | number;
}): JSX.Element {
  useSuspenseImage(src);
  return (
    <img
      className={className || undefined}
      src={src}
      alt={altText}
      ref={imageRef}
      style={{
        height,
        width,
        maxWidth: "100%",
      }}
      draggable="false"
    />
  );
}

export default function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  resizable,
}: {
  altText: string;
  caption: LexicalEditor;
  height: string | number;
  nodeKey: NodeKey;
  resizable: boolean;
  showCaption: boolean;
  src: string;
  width: string | number;
  captionsEnabled: boolean;
}): JSX.Element {
  const imageRef = useRef<null | HTMLImageElement>(null);
  const [isSelected, setSelected] = useLexicalNodeSelection(nodeKey);
  // const {isCollabActive} = useCollaborationContext();
  const [editor] = useLexicalComposerContext();
  const [_width, setWidth] = useState<string | number>(width);

  const handleWidthChange = (w: number | string) => {
    editor.update(() => {
      const node = $getNodeByKey<ImageNode>(nodeKey);
      if (w === "auto") {
        node?.setWidthAndHeight(w, "auto");
      } else {
        node?.setWidthAndHeight(w, height);
      }
    });
    setWidth(w);
  };

  const onClick = useCallback(
    (e: MouseEvent) => {
      if (e.target === imageRef.current) {
        setSelected(true);
      }
      return false;
    },
    [setSelected]
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW)
    );
  }, [editor, onClick, setSelected]);

  return (
    <Suspense fallback={null}>
      <div style={{ width: "100%", display: "inline-block" }}>
        <LazyImage
          className={isSelected ? `focused` : null}
          src={src}
          altText={altText}
          imageRef={imageRef}
          width={width}
          height={height}
        />
        {resizable && isSelected && (
          <WidthSetter value={_width} onChange={handleWidthChange} />
        )}
      </div>
    </Suspense>
  );
}
