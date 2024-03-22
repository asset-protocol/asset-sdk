import { LexicalEditor } from "./lexical";

export type RichTextEditorProps = {
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
};

export default function AssetRichTextEditor(props: RichTextEditorProps) {
  return <LexicalEditor {...props} editable />;
}
