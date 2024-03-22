import { Button } from "antd";
import clsx from "clsx";

export function AddressLink(props: {
  address: string;
  to?: string;
  className?: string;
}) {
  return (
    <Button type="link" className={clsx("text-base p-0", props.className)}>
      {formatAddress(props.address)}
    </Button>
  );
}

export function formatAddress(address: string) {
  return `${address.slice(0, 10)}...${address.slice(-4)}`;
}
