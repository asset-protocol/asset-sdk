import { Divider, Modal, ModalProps } from "antd";
import { Asset } from "../../client/core";
import { Link } from "../Link/Link";
import { replaceUri } from "../../lib/utils";
import { ZeroAddress } from "ethers";

export function AssetInfoCard({ asset }: { asset: Asset }) {
  const data = [
    {
      label: "Hub Contract",
      value: (
        <span>
          <span className="font-bold">{asset.hubName}</span>#
          <Link>{asset.hub}</Link>
        </span>
      ),
    },
    { label: "Author", value: <Link>{asset.publisher}</Link> },
    {
      label: "Content URI",
      value: (
        <Link href={replaceUri(asset.contentUri)} target="_blank">
          {asset.contentUri}
        </Link>
      ),
    },
    { label: "Create tx hash", value: <Link>{asset.hash}</Link> },
  ];
  if (asset.collectNft) {
    data.push({
      label: "Collect NFT",
      value: <Link>{asset.collectNft}</Link>,
    });
  }
  if (asset.collectModule && asset.collectModule !== ZeroAddress) {
    data.push({
      label: "Collect Module",
      value: <Link>{asset.collectModule}</Link>,
    });
  }
  if (asset.gatedModule && asset.gatedModule !== ZeroAddress) {
    data.push({
      label: "Gated Module",
      value: <Link>{asset.gatedModule}</Link>,
    });
  }
  data.push({
    label: "Create At",
    value: (
      <span>
        {new Date(Number.parseInt(asset.timestamp.toString())).toUTCString()}
      </span>
    ),
  });
  return (
    <div className="pt-4 flex flex-col">
      {data.map(({ label, value }, index) => (
        <div key={label}>
          <span className="text-gray-500">{label}:</span> {value}
          {index < data.length - 1 && <Divider className="my-2"/>}
        </div>
      ))}
    </div>
  );
}

export type AssetInfoProps = ModalProps & {
  asset: Asset;
};

export function AssetInfoModal(props: AssetInfoProps) {
  return (
    <Modal
      cancelText="Close"
      okButtonProps={{ style: { display: "none" } }}
      transitionName=""
      maskTransitionName=""
      title={props.asset.name}
      width={720}
      {...props}
    >
      <AssetInfoCard asset={props.asset} />
    </Modal>
  );
}
