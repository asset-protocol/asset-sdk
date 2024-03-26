import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import {
  LexicalComposer,
  InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { EditorState } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import ToolBarPlugin from "./plugins/ToolbarPlugin/ToolbarPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { useEffect } from "react";
import { clsx } from "clsx";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import editorNodes from "./nodes/editorNodes";
import ImagesPlugin, { UPDATE_IMAGE_COMMAND } from "./plugins/ImagesPlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import { useReplaceUri } from "../../../../lib/utils";
import { useFetchBlob } from "../../../../client/indexer";
import { UPDATE_VIDEO_COMMAND, VideoPlugin } from "./plugins/VideoPlugin";
import { Affix } from "antd";
import EditorTheme from "./theme/EditorTheme";

export type LexicalEditorProps = {
  value?: string;
  editable?: boolean;
  onChange?: (v: string) => void;
  classname?: string;
};

// When the editor changes, you can get notified via the
// OnChangePlugin!
function MyOnChangePlugin({
  onChange,
}: {
  onChange: (v: EditorState) => void;
}) {
  // Access the editor through the LexicalComposerContext
  const [editor] = useLexicalComposerContext();
  // Wrap our listener in useEffect to handle the teardown and avoid stale references.
  useEffect(() => {
    // most listeners return a teardown function that can be called to clean them up.
    return editor.registerUpdateListener(({ editorState }) => {
      // call onChange here to pass the latest state up to the parent.
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}

export function BlobImagesPlugin() {
  const replaceUri = useReplaceUri();
  const fetchBlob = useFetchBlob();
  const editor = useLexicalComposerContext()[0];
  return (
    <ImagesPlugin
      captionsEnabled={false}
      preRender={(src) => replaceUri(src) ?? ""}
      onConvertImageNode={(payload, preNode) => {
        console.log(payload.src);
        fetchBlob(payload.src)
          .then((res) => {
            if (res) {
              const newPalyload = {
                ...payload,
                src: URL.createObjectURL(res),
                key: preNode.getKey(),
              };
              editor.dispatchCommand(UPDATE_IMAGE_COMMAND, newPalyload);
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }}
    />
  );
}

export function BlobVideoPlugin() {
  const replaceUri = useReplaceUri();
  const fetchBlob = useFetchBlob();
  const editor = useLexicalComposerContext()[0];
  return (
    <VideoPlugin
      preRedner={(pd) => {
        pd.src = replaceUri(pd.src) ?? "";
      }}
      onConvertElement={(videoProps, preNode) => {
        console.log(videoProps.src);
        fetchBlob(videoProps.src)
          .then((res) => {
            if (res) {
              const newPalyload = {
                ...videoProps,
                src: URL.createObjectURL(res),
                key: preNode.getKey(),
              };
              editor.dispatchCommand(UPDATE_VIDEO_COMMAND, newPalyload);
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }}
    />
  );
}

export function LexicalEditor(props: LexicalEditorProps) {
  const initialConfig: InitialConfigType = {
    namespace: "richTestViewer",
    // theme: {},
    editable: props.editable,
    onError: (e: unknown) => {
      console.error(e);
    },
    nodes: editorNodes,
    editorState: props.value ? props.value : null,
    theme: EditorTheme,
  };

  const onChange = (editorState: EditorState) => {
    if (props.onChange) {
      const jsonNodes = editorState.toJSON();
      props.onChange(JSON.stringify(jsonNodes));
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={clsx("flex flex-col", props.classname)}>
        <RichTextPlugin
          contentEditable={
            props.editable ? (
              <div
                className={`flex-1 flex flex-col border-[1px] border-solid border-gray-300`}
              >
                <Affix offsetTop={72}>
                  <div className="py-2 text-2xl border-0 border-b-[1px] px-2 border-solid border-gray-300 bg-[#ffffff99] backdrop-blur-lg">
                    <ToolBarPlugin />
                  </div>
                </Affix>
                <ContentEditable className="focus-visible:outline-none flex-1 overflow-auto px-4" />
              </div>
            ) : (
              <ContentEditable className="focus-visible:outline-none flex-1 overflow-auto" />
            )
          }
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <AutoLinkPlugin />
        <LinkPlugin />
        <BlobImagesPlugin />
        <BlobVideoPlugin />
        <CodeHighlightPlugin />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <CheckListPlugin />
        <ListPlugin />
        <HashtagPlugin />
        <MyOnChangePlugin onChange={onChange} />
      </div>
    </LexicalComposer>
  );
}
