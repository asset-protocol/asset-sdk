import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import {
  LexicalComposer,
  InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { EditorState } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import ToolBarPlugin from "./plugins/ToolbarPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { useEffect } from "react";
import { clsx } from "clsx";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import editorNodes from "./nodes/editorNodes";

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

export function LexicalEditor(props: LexicalEditorProps) {
  console.log("state: ", props.value ? props.value : null);
  const initialConfig: InitialConfigType = {
    namespace: "richTestViewer",
    // theme: {},
    editable: props.editable,
    onError: (e: unknown) => {
      console.error(e);
    },
    nodes: editorNodes,
    editorState: props.value ? props.value : null,
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
        <div className="flex-1 h-full">
          <AutoLinkPlugin />
          <CodeHighlightPlugin />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <RichTextPlugin
            contentEditable={
              props.editable ? (
                <div
                  className={`h-full flex flex-col border-[1px] border-solid border-gray-300`}
                >
                  <div className="bg-white py-2 border-0 border-b-[1px] px-2 border-solid border-gray-300">
                    <ToolBarPlugin />
                  </div>
                  <ContentEditable className="focus-visible:outline-none flex-1 overflow-auto px-4" />
                </div>
              ) : (
                <ContentEditable className="focus-visible:outline-none flex-1 overflow-auto" />
              )
            }
            placeholder={<div>Enter some text...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <MyOnChangePlugin onChange={onChange} />
        </div>
      </div>
    </LexicalComposer>
  );
}
