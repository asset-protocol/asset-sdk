import { Input } from "antd";

export type ExternalLinkEditorProps = {
  value?: string;
  onChange?: (v: string) => void;
};

export default function ExternalLinkEditor(props: ExternalLinkEditorProps) {
  return (
    <Input
      value={props.value}
      onChange={(e) => props.onChange?.(e.target.value)}
    />
  );
}
