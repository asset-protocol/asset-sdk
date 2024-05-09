import { Avatar, Button, Modal, ModalProps } from "antd";
import { AddressLink } from "../Address/AddressLink";
import { UserOutlined } from "@ant-design/icons";
import { ZeroAddress, formatEther } from "ethers";
import { Asset } from "../../client/core";
import { useReplaceUri } from "../../lib/utils";
import { ZERO_BYTES } from "../../core";
import {
  useCollectAsset,
  useGetHubGlobalModuleConfig,
} from "../../hook/assethub";
import { useAssetHub, useHubERC20Approve } from "../..";
import { useState } from "react";
export type CollectModalProps = Omit<ModalProps, "onOk"> & {
  asset: Asset;
  onCollected?: (tokenId: bigint) => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export function hasCollectModule(asset: Asset) {
  return asset.collectModule && asset.collectModule !== ZeroAddress;
}

export function CollectModal(props: CollectModalProps) {
  const { asset, onCollected, ...resProps } = props;
  const { ctx, account, requireLogin } = useAssetHub();
  const replaceUri = useReplaceUri();
  const { collect } = useCollectAsset();

  const [loading, setLoading] = useState(false);
  const { config: globalTokenConfig } = useGetHubGlobalModuleConfig();
  const { approve } = useHubERC20Approve();

  const collectModule =
    asset.collectModule !== undefined
      ? ctx.collectModules
          .find((m) => m.moduleContract === asset.collectModule)
          ?.useCollect(asset, {
            module: asset.collectModule,
            initData: asset.collectModuleInitData,
          })
      : undefined;

  const handleCollect = async () => {
    if (!account) {
      requireLogin?.();
      return;
    }
    setLoading(true);
    try {
      const options = {};
      if (collectModule?.beforeCollect) {
        const success = await collectModule.beforeCollect(
          asset.assetId,
          options
        );
        if (!success) return;
      }
      if (globalTokenConfig) {
        console.log("globalTokenConfig", globalTokenConfig);
        await approve(globalTokenConfig.token, globalTokenConfig.collectFee);
      }
      const tokenId = await collect(
        asset.hub,
        asset.assetId,
        {
          collectData: ZERO_BYTES,
        },
        options
      );
      if (tokenId) {
        onCollected?.(tokenId);
      }
    } finally {
      setLoading(false);
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
              src={replaceUri(props.asset?.image)}
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
              <div className="font-bold">Base sepolia</div>
            </div>
          </div>
          {collectModule && collectModule.viewNode}
          <div className="flex-1"></div>
          {globalTokenConfig && (
            <div>Token Fee: {formatEther(globalTokenConfig.collectFee)}</div>
          )}
          <Button
            type="primary"
            className="w-full my-2"
            size="large"
            loading={loading}
            onClick={handleCollect}
            // disabled={!!collectModule?.errorText}
          >
            {(collectModule && collectModule.collectButtonText) || "Collect"}
          </Button>
          {collectModule?.errorText || (
            <div className="text-gray-500">
              Mint this asset as an NFT to add it to your collection.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
