import { useEffect } from "react";
import {
  InsertVideoPayload,
  VideoComponentProps,
} from "../../nodes/VideoComponent";
import { $createVideoNode, VideoNode } from "../../nodes/VideoNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $getNodeByKey,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  LexicalCommand,
  LexicalEditor,
  createCommand,
} from "lexical";
import { Upload } from "antd";
import { useBlobRequest } from "../../../../../../lib/request";

export const INSERT_VIDEO_COMMAND: LexicalCommand<InsertVideoPayload> =
  createCommand("INSERT_VIDEO_COMMAND");

export const UPDATE_VIDEO_COMMAND: LexicalCommand<InsertVideoPayload> =
  createCommand("UPDATE_VIDEO_COMMAND");

export function VideoUploadButton(props: {
  editor: LexicalEditor;
  children?: React.ReactNode;
}) {
  const { editor } = props;
  const blobRequest = useBlobRequest();
  return (
    <Upload
      showUploadList={false}
      customRequest={blobRequest}
      onChange={(f) => {
        if (f.file.response) {
          editor.dispatchCommand(INSERT_VIDEO_COMMAND, {
            src: f.file.response,
          });
        }
      }}
    >
      {props.children}
    </Upload>
  );
}

export function VideoPlugin(props: {
  preRedner?: (props: VideoComponentProps) => void;
  onConvertElement?: (props: VideoComponentProps, preNode: VideoNode) => void;
}) {
  const [editor] = useLexicalComposerContext();

  VideoNode.preRedner = props.preRedner;
  VideoNode.onConvertElement = props.onConvertElement;

  useEffect(() => {
    if (!editor.hasNodes([VideoNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor");
    }
    return mergeRegister(
      editor.registerCommand<InsertVideoPayload>(
        INSERT_VIDEO_COMMAND,
        (payload) => {
          const videoNode = $createVideoNode(payload);
          $insertNodes([videoNode]);
          if ($isRootOrShadowRoot(videoNode.getParentOrThrow())) {
            $wrapNodeInElement(videoNode, $createParagraphNode).selectEnd();
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<InsertVideoPayload>(
        UPDATE_VIDEO_COMMAND,
        (payload) => {
          const imageNode = new VideoNode({
            src: payload.src,
            width: payload.width,
          });
          $getNodeByKey(payload.key!)?.replace(imageNode, false);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);
  return null;
}
