import { ReactNode } from "react";

export type Info = {
  label: string;
  value: string;
};

export const ASSET_TYPE_UNKNOW = "";

export type IEditorProps = {
  [key: string]: unknown;
};

export type IEditor = (props: IEditorProps) => ReactNode;

export type IEditorProvider = {
  types: Info[];
  selector: (type: string) => boolean;
  editor: IEditor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useOnSubmit?: () => ((cur: any, pre?: string) => Promise<string>);
}