import { Asset } from "../../../client/core";
import { AssetViewerHeader } from "../../../components";

export default function UnknownViewer({ value }: { value: Asset }) {
  return (
    <div className="mx-w-[1080px] mx-auto">
      <AssetViewerHeader></AssetViewerHeader>
      <div>UnknownViewer{value.name}</div>
    </div>
  );
}
