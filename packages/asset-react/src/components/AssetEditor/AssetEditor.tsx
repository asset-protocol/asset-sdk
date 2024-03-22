import { AssetMetadataEditor } from "./AssetMetadataEditor";
import clsx from "clsx";
import {
  AssetEditorProvider,
  AssetEditorProviderProps,
} from "./AssetEditorContext";
import { AssetEditorPanel } from "./AssetEnditorPanel";

export type AssetEditorProps = Omit<AssetEditorProviderProps, "children"> & {
  className?: string;
};

export function AssetEditor(props: AssetEditorProps) {
  const { className, ...resProps } = props;

  return (
    <AssetEditorProvider {...resProps}>
      <div className={clsx("mt-4", className)}>
        <AssetEditorPanel />
        <AssetMetadataEditor />
      </div>
    </AssetEditorProvider>
  );
}
