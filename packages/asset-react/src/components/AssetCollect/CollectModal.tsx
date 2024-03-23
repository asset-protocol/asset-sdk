import { Avatar, Button, Modal, ModalProps } from "antd";
import { AddressLink } from "../Address/AddressLink";
import { UserOutlined } from "@ant-design/icons";
import { ZeroAddress } from "ethers";
import { Asset } from "../../client/core";
import { useReplaceUri } from "../../lib/utils";
import { ZERO_BYTES, parseFeeCollectModuleInitData } from "../../core";
import { useCollectAsset } from "../../hook/assethub";
import { useERC20BalanceOf } from "../../hook";
import { useEffect, useMemo, useState } from "react";
export type CollectModalProps = Omit<ModalProps, "onOk"> & {
  asset: Asset;
  account?: string;
  requestLogin?: () => void;
  onCollected?: (tokenId: bigint) => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export function hasCollectModule(asset: Asset) {
  return asset.collectModule && asset.collectModule !== ZeroAddress;
}

export function CollectModal(props: CollectModalProps) {
  const { asset, onCollected, ...resProps } = props;

  const replaceUri = useReplaceUri();
  const { collect, isLoading } = useCollectAsset();

  const [balance, setBalance] = useState<bigint>();

  const useCollectModule = hasCollectModule(asset);
  const collectModuleData = parseFeeCollectModuleInitData(
    asset.collectModuleInitData
  );
  const erc20BalanceOf = useERC20BalanceOf(
    collectModuleData?.currency ?? ZeroAddress
  );

  const hasNoBalance = useMemo(
    () =>
      (useCollectModule &&
        balance &&
        balance < BigInt(collectModuleData?.amount ?? 0)) ??
      false,
    [balance, collectModuleData?.amount, useCollectModule]
  );

  useEffect(() => {
    if (props.account) {
      erc20BalanceOf(props.account).then((b) =>
        setBalance(b === undefined ? b : BigInt(b))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [erc20BalanceOf, props.account]);

  const handleCollect = async () => {
    if (!props.account) {
      props.requestLogin?.();
      return;
    }
    const tokenId = await collect(asset.assetId, {
      module: asset.collectModule ?? ZeroAddress,
      initData: asset.collectModuleInitData ?? ZERO_BYTES,
      collectData: "0x",
    });
    if (tokenId) {
      onCollected?.(tokenId);
    }
  };

  return (
    <Modal
      destroyOnClose
      centered
      footer={null}
      title="Collect Asset"
      width={700}
      transitionName=""
      maskTransitionName=""
      className="h-[max-content]"
      wrapClassName="backdrop-blur-md"
      {...resProps}
    >
      <div className="flex flex-wrap gap-6 text-base items-center">
        <div className="flex-[3] min-w-[100px]">
          <div className="shadow-md rounded-lg overflow-hidden">
            <img
              src={replaceUri(props.asset.normalizedMetadata?.image)}
              alt=""
              className="w-full object-cover aspect-[2/1]"
            />
            <div className="line-clamp-2 text-xl flex-1 px-4 py-1 font-bold">
              {props.asset.name}
            </div>
            <div className="px-4 pt-4 text-lg">
              <Avatar
                className="mr-2 bg-[#87d068]"
                size={32}
                icon={<UserOutlined />}
              />
              <AddressLink address={asset.publisher} />
            </div>
            <div className="mt-4"></div>
          </div>
        </div>
        <div className="flex-[4]">
          <div className="line-clamp-2 text-2xl my-4 font-bold">
            {props.asset.name}
          </div>
          <div className="flex items-center gap-6 mt-4 mb-6 px-4 py-4 rounded-lg bg-gray-100">
            <div>
              <div className="text-gray-500">Collected</div>
              <div className="font-bold">
                {asset.collectCount?.toString() ?? 0}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Standard</div>
              <div className="font-bold">ERC721</div>
            </div>
            <div>
              <div className="text-gray-500">Network</div>
              <div className="font-bold">Polygon mumbai</div>
            </div>
          </div>
          {collectModuleData && (
            <>
              <div className="my-1">
                Token Contract:
                <AddressLink
                  address={collectModuleData.currency}
                  to=""
                  className="mx-2"
                />
              </div>
              <div className="my-1">
                Token Recipient:
                <AddressLink
                  address={collectModuleData.recipient}
                  to=""
                  className="mx-2"
                />
              </div>
            </>
          )}
          <div className="flex-1"></div>
          <Button
            type="primary"
            className="w-full my-2"
            size="large"
            loading={isLoading}
            onClick={handleCollect}
          >
            {!useCollectModule && "Collect for Free"}
            {useCollectModule &&
              `Collect for ${collectModuleData?.amount.toString()} Token`}
          </Button>
          {hasNoBalance ? (
            <div className="text-red-400">
              {`Requires a minimum token balance of ${collectModuleData?.amount.toString()}, current: ${balance?.toString()}`}
            </div>
          ) : (
            <div className="text-gray-500">
              {" "}
              Mint this asset as an NFT to add it to your collection.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
