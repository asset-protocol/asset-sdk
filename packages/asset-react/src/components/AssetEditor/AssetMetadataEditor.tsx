import { IEditorProps } from "../../core";
import { useEditorProvider as useEditorProviderSelector } from "../../hook";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import { useAssetEditor } from "./AssetEditorContext";

export type AssetContentEditorProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editorProps?: { [key: string]: any };
};

export function AssetMetadataEditor(props: AssetContentEditorProps) {
  const { type } = useAssetEditor();
  const selectEditor = useEditorProviderSelector();
  const editorProvider = useMemo(() => {
    if (type) {
      return selectEditor(type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);
  const Editor = useMemo(() => {
    if (editorProvider) {
      return forwardRef((refProps: IEditorProps, ref) => {
        const onSubmit = editorProvider!.useOnSubmit?.();
        useImperativeHandle(ref, () => ({
          onSubmit: onSubmit || ((v) => v),
        }));
        const EditorComponent = editorProvider!.editor;
        return <EditorComponent {...refProps} />;
      });
    }
  }, [editorProvider]);

  return Editor ? <Editor {...props.editorProps} /> : null;
}
