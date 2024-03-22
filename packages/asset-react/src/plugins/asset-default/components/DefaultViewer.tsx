import { Asset } from "../../../client/core";
import { AssetViewerWithHeader } from "../../../components";

export default function UnknownViewer({ value }: { value: Asset }) {
  return (
    <div className="mx-w-[1080px] mx-auto">
      <AssetViewerWithHeader></AssetViewerWithHeader>
      <div>UnknownViewer{value.name}</div>
    </div>
  );
}
