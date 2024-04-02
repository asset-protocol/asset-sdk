import { ReactNode } from "react";

export type Info = {
  label: string;
  value: string;
};

export const ASSET_TYPE_UNKNOW = "";


export type IEditorProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
};

export type IEditor = (props: IEditorProps) => ReactNode;

export type IEditorProvider = {
  types: Info[];
  selector: (type: string) => boolean;
  editor: IEditor;
  useBeforePublish?: () => ((cur: string, pre?: string, onProgress?: (percent: number) => void) => Promise<string>);
}