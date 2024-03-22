import { Asset } from "../../../client/core";

export default function AudioViewer({ value }: { value: Asset }) {
  return <div>AudioViewer,{value.name}</div>;
}
