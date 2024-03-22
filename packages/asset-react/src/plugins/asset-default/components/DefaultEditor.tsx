import { Input } from "antd";

export type ContentEditorProps = {
  value?: string;
  onChange?: (v: string) => void;
};

export default function ContentEditor(props: ContentEditorProps) {
  return (
    <Input.TextArea
      value={props.value}
      onChange={(e) => props.onChange?.(e.target.value)}
    />
  );
}
