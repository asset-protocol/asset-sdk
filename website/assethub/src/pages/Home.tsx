import { Button, Divider, Input, Select, message } from "antd";
// import assetHubAbi from "../abi/AssetHub.json";
// import erc20Abi from "../abi/IERC20.json";
// import { AssetHub, FeeAssetModule, TestToken, admin } from "../context/consts";
import { useEffect, useState } from "react";
import {
  Asset,
  AssetList,
  useAssetHub,
  useDeployNewAssetHub,
  useGetAssetHubs,
} from "@asset-protocol/react";
import { DefaultOptionType } from "antd/es/select";
import { useNavigateAssetHub } from "../utils/route";
import { useNavigate, useParams } from "react-router-dom";
import { ZeroAddress } from "ethers";

export function Home() {
  const navigateHub = useNavigateAssetHub();
  const navigate = useNavigate();
  const { changeHub, hubInfo } = useAssetHub();
  const { hub } = useParams();

  const [hubOptions, setHubOptions] = useState<DefaultOptionType[]>([]);
  const [hubName, setHubName] = useState<string>();
  const { data, loading } = useGetAssetHubs();

  useEffect(() => {
    if (data) {
      setHubOptions(
        data?.map((hub) => ({ label: hub.name, value: hub.id })) || []
      );
      if (!hubInfo) {
        if (hub === "home") {
          changeHub(data[0]?.id);
        } else {
          changeHub(hub);
        }
      } else if (hub !== "home" && hubInfo.id !== hub && hubInfo.name !== hub) {
        changeHub(hub);
      }
    }
  }, [changeHub, data, hub, hubInfo]);

  // const { data: count } = useReadContract({
  //   address: AssetHub,
  //   abi: assetHubAbi,
  //   functionName: "count",
  //   args: [account.address],
  // });

  // const { data: tokenBalance } = useReadContract({
  //   address: TestToken,
  //   abi: erc20Abi,
  //   functionName: "balanceOf",
  //   args: [account.address],
  // });

  // const { data: assetModuleTokenBalance } = useReadContract({
  //   address: TestToken,
  //   abi: erc20Abi,
  //   functionName: "balanceOf",
  //   args: [admin],
  // });

  const hanldeClickAsset = (asset: Asset) => {
    navigateHub("asset/" + asset.assetId.toString());
  };

  const { deploy, isLoading: deploying } = useDeployNewAssetHub();
  const handleDeployHub = async () => {
    try {
      if (hubName) {
        const address = await deploy({
          admin: ZeroAddress,
          name: hubName,
          createModule: ZeroAddress,
        });
        message.success(`Deployed AssetHub: ${address}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      message.error(e.message);
    }
  };

  if (loading) {
    return (
      <div className="pt-6">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1080px] mx-auto flex flex-col gap-3 m-auto pt-6">
      <div>
        All AssetHubs:
        <Select
          className="ml-4 w-[200px]"
          value={hubInfo?.id}
          options={hubOptions}
          onChange={(value) => {
            const hub = hubOptions.find((h) => h.value === value);
            if (hub) {
              navigate("/" + hub.label);
            }
          }}
        ></Select>
      </div>
      <div className="flex gap-2">
        <Button loading={deploying} onClick={handleDeployHub}>
          Deploy New AssetHub
        </Button>
        <Input
          placeholder="Input New AssetHub Name"
          className="w-[260px]"
          value={hubName}
          onChange={(t) => setHubName(t.target.value!)}
        ></Input>
      </div>
      <Divider className="my-2 bg-gray-300" />
      {/* <div>TestToken: {TestToken}</div> */}
      <div>AssetHub Name: {hubInfo?.name}</div>
      <div>AssetHub: {hubInfo?.id}</div>
      <div>AssetHub Admin: {hubInfo?.admin}</div>
      <div>AssetHub Version: {hubInfo?.version}</div>
      <div>
        AssetHub CreateTime:{" "}
        {hubInfo?.timestamp
          ? new Date(Number.parseInt(hubInfo.timestamp.toString())).toString()
          : ""}
      </div>
      <div>NftGatedModule: {hubInfo?.nftGatedModule}</div>
      {/* <div>
        AssetModule Account Token Balance: {assetModuleTokenBalance?.toString()}
      </div>
      <div>AssetCount: {count?.toString()}</div>
      <div>Test Token Balance: {tokenBalance?.toString()}</div> */}
      <div>
        <Button onClick={() => navigateHub("/asset/create")}>创建资产</Button>
      </div>
      <Divider className="my-2 bg-gray-300" />
      Assets List:
      <AssetList
        grid={{ column: 4, gutter: 12, xs: 2, sm: 3 }}
        onAssetClick={hanldeClickAsset}
        // itemClassName="w-[240px]"
      ></AssetList>
    </div>
  );
}
