import { AssetMetadataEditor } from "./AssetMetadataEditor";
import clsx from "clsx";
import {
  AssetEditorProvider,
  AssetEditorProviderProps,
} from "./AssetEditorContext";
import { AssetEditorPanel } from "./AssetEnditorPanel";

export type AssetEditorProps = Omit<AssetEditorProviderProps, "children"> & {
  className?: string;
  onPublished?: (assetId: bigint) => void;
};

export function AssetEditor(props: AssetEditorProps) {
  const { className, onPublished, ...resProps } = props;
  return (
    <AssetEditorProvider {...resProps}>
      <div className={clsx("", className)}>
        <AssetEditorPanel onPublished={onPublished}/>
        <AssetMetadataEditor />
      </div>
    </AssetEditorProvider>
  );
}
