import clsx from "clsx";
import { AssetEditorHeader } from "../../../components";
import { useAssetEditor } from "../../../components/AssetEditor/AssetEditorContext";
import { Suspense, lazy } from "react";
export const LexicalEditor = lazy(() => import("./lexical"));

export type RichTextEditorProps = {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export default function AssetRichTextEditor(props: RichTextEditorProps) {
  const { content, setContent } = useAssetEditor();
  return (
    <>
      <AssetEditorHeader descriptonPlaceholder="Input Summary" />
      <Suspense>
        <LexicalEditor
          classname={clsx("min-h-[500px]", props.className)}
          value={content}
          editable
          onChange={(v) => {
            setContent(v);
          }}
        />
      </Suspense>
    </>
  );
}
