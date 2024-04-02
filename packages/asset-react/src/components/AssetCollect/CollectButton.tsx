import { Button } from "antd";
import { CollectModal } from "./CollectModal";
import { useState } from "react";
import { Asset } from "../../client/core";

export type CollectButtonProps = {
  asset: Asset;
  requestLOgin?: () => void;
  collectedCount?: number;
  multiCollect?: boolean;
  className?: string;
  onCollected?: (tokenId: bigint) => void;
};

export function CollectButton(props: CollectButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const collectedCount = props.collectedCount ?? 0;

  return (
    <div>
      <Button
        className={props.className}
        type="primary"
        onClick={() => {
            setIsOpen(true);
        }}
        disabled={!props.multiCollect && collectedCount <= 0}
      >
        {collectedCount > 0 ? `Collected(${collectedCount})` : "Collect"}
      </Button>
      <CollectModal
        open={isOpen}
        maskClosable={false}
        onCollected={(tokenId) => {
          setIsOpen(false);
          props.onCollected?.(tokenId);
        }}
        onCancel={() => setIsOpen(false)}
        asset={props.asset}
      />
    </div>
  );
}
