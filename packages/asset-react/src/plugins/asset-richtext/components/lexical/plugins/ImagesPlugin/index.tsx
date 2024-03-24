/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $createRangeSelection,
  $getNodeByKey,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  LexicalCommand,
  LexicalEditor,
  LexicalNode,
} from "lexical";
import { useEffect, useRef, useState } from "react";

import {
  $createImageNode,
  $isImageNode,
  ImageNode,
  ImagePayload,
} from "../../nodes/ImageNode";
import { Button, Input, Modal, ModalProps, Tabs, Upload } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { useBlobRequest } from "../../../../../../lib/request";

export type InsertImagePayload = Readonly<ImagePayload>;

const getDOMSelection = (targetWindow: Window | null): Selection | null =>
  (targetWindow || window).getSelection();

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND");

export const UPDATE_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand("UPDATE_IMAGE_COMMAND");

export function InsertImageUriDialogBody({
  onClick,
}: {
  onClick: (payload: InsertImagePayload) => void;
}) {
  const [src, setSrc] = useState("");
  const [altText, setAltText] = useState("");

  const isDisabled = src === "";

  return (
    <div className="flex flex-col gap-2">
      <Input
        // label="Image URL"
        placeholder="i.e. https://source.unsplash.com/random"
        onChange={(v) => setSrc(v.target.value)}
        value={src}
        data-test-id="image-modal-url-input"
      />
      <Input
        // label="Alt Text"
        placeholder="Random unsplash image"
        onChange={(v) => setAltText(v.target.value)}
        value={altText}
        data-test-id="image-modal-alt-text-input"
      />
      <Button
        data-test-id="image-modal-confirm-btn"
        disabled={isDisabled}
        onClick={() => onClick({ altText, src })}
      >
        Confirm
      </Button>
    </div>
  );
}

export function InsertImageUploadedDialogBody({
  onClick,
}: {
  onClick: (payload: InsertImagePayload) => void;
}) {
  const [src, setSrc] = useState("");
  const [altText, setAltText] = useState("");

  const isDisabled = src === "";

  const loadImage = (params: UploadChangeParam) => {
    setSrc(params.file.response as string);
  };
  const blobRequest = useBlobRequest();
  return (
    <div className="flex gap-2 flex-col">
      <Upload.Dragger
        // label="Image Upload"
        onChange={loadImage}
        showUploadList={false}
        customRequest={blobRequest}
        accept="image/*"
      >
        {!src ? (
          <p>Upload Image</p>
        ) : (
          <img style={{ width: "100%" }} src={src} alt="upload" />
        )}
      </Upload.Dragger>
      <Input
        placeholder="Descriptive alternative text"
        onChange={(v) => setAltText(v.target.value)}
        value={altText}
        data-test-id="image-modal-alt-text-input"
      />
      <Button
        data-test-id="image-modal-file-upload-btn"
        disabled={isDisabled}
        onClick={() => onClick({ altText, src })}
      >
        Confirm
      </Button>
    </div>
  );
}

export type InsertImageDialogProps = Omit<ModalProps, "onCancel" | "onOk"> & {
  editor: LexicalEditor;
  onClose?: () => void;
};

export function InsertImageDialog(props: InsertImageDialogProps): JSX.Element {
  const { editor, onClose, ...resProps } = props;

  const hasModifier = useRef(false);

  useEffect(() => {
    hasModifier.current = false;
    const handler = (e: KeyboardEvent) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [editor]);

  const onClick = (payload: InsertImagePayload) => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    onClose?.();
  };

  const items = [
    {
      label: `Local File`,
      key: "FILE",
      children: <InsertImageUploadedDialogBody onClick={onClick} />,
    },
    {
      label: `Image URL`,
      key: "URL",
      children: <InsertImageUriDialogBody onClick={onClick} />,
    },
  ];

  return (
    <Modal
      destroyOnClose
      title="Insert a image"
      transitionName=""
      maskTransitionName=""
      footer={null}
      maskClosable={false}
      onCancel={() => onClose?.()}
      {...resProps}
    >
      <Tabs accessKey="FILE" items={items}></Tabs>
    </Modal>
  );
}

export default function ImagesPlugin({
  captionsEnabled,
  srcHandler,
  onConvertImageNode,
}: {
  captionsEnabled?: boolean;
  srcHandler?: (src: string) => string;
  onConvertImageNode?: (payload: ImagePayload, preNode: LexicalNode) => void;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  ImageNode.srcHandler = srcHandler;
  ImageNode.onConvertImageNode = onConvertImageNode;
  console.log("ImageNode", ImageNode.srcHandler);
  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }
          console.log("INSERT_IMAGE_COMMAND");
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<InsertImagePayload>(
        UPDATE_IMAGE_COMMAND,
        (payload) => {
          const imageNode = new ImageNode(
            payload.src,
            payload.altText,
            payload.maxWidth ?? 1000,
            payload.width,
            payload.height,
            payload.showCaption,
            payload.caption,
            payload.captionsEnabled
          );
          $getNodeByKey(payload.key!)?.replace(imageNode, false);
          // $insertNodes([imageNode]);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<DragEvent>(
        DRAGSTART_COMMAND,
        (event) => {
          console.log("DRAGSTART_COMMAND");
          return onDragStart(event);
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand<DragEvent>(
        DRAGOVER_COMMAND,
        (event) => {
          console.log("DRAGOVER_COMMAND");
          return onDragover(event);
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<DragEvent>(
        DROP_COMMAND,
        (event) => {
          console.log("DROP_COMMAND");
          return onDrop(event, editor);
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [captionsEnabled, editor]);

  return null;
}

const TRANSPARENT_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const img = document.createElement("img");
img.src = TRANSPARENT_IMAGE;

function onDragStart(event: DragEvent): boolean {
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) {
    return false;
  }
  dataTransfer.setData("text/plain", "_");
  dataTransfer.setDragImage(img, 0, 0);
  dataTransfer.setData(
    "application/x-lexical-drag",
    JSON.stringify({
      data: {
        altText: node.__altText,
        caption: node.__caption,
        height: node.__height,
        key: node.getKey(),
        maxWidth: node.__maxWidth,
        showCaption: node.__showCaption,
        src: node.__src,
        width: node.__width,
      },
      type: "image",
    })
  );

  return true;
}

function onDragover(event: DragEvent): boolean {
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  if (!canDropImage(event)) {
    event.preventDefault();
  }
  return true;
}

function onDrop(event: DragEvent, editor: LexicalEditor): boolean {
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const data = getDragImageData(event);
  if (!data) {
    return false;
  }
  event.preventDefault();
  if (canDropImage(event)) {
    const range = getDragSelection(event);
    node.remove();
    const rangeSelection = $createRangeSelection();
    if (range !== null && range !== undefined) {
      rangeSelection.applyDOMRange(range);
    }
    $setSelection(rangeSelection);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
  }
  return true;
}

function getImageNodeInSelection(): ImageNode | null {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) {
    return null;
  }
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isImageNode(node) ? node : null;
}

function getDragImageData(event: DragEvent): null | InsertImagePayload {
  const dragData = event.dataTransfer?.getData("application/x-lexical-drag");
  if (!dragData) {
    return null;
  }
  const { type, data } = JSON.parse(dragData);
  if (type !== "image") {
    return null;
  }

  return data;
}

declare global {
  interface DragEvent {
    rangeOffset?: number;
    rangeParent?: Node;
  }
}

function canDropImage(event: DragEvent): boolean {
  const target = event.target;
  return !!(
    target &&
    target instanceof HTMLElement &&
    !target.closest("code, span.editor-image") &&
    target.parentElement &&
    target.parentElement.closest("div.ContentEditable__root")
  );
}

function getDragSelection(event: DragEvent): Range | null | undefined {
  let range;
  const target = event.target as null | Element | Document;
  const targetWindow =
    target == null
      ? null
      : target.nodeType === 9
      ? (target as Document).defaultView
      : (target as Element).ownerDocument.defaultView;
  const domSelection = getDOMSelection(targetWindow);
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
    range = domSelection.getRangeAt(0);
  } else {
    throw Error(`Cannot get the selection when dragging`);
  }

  return range;
}
