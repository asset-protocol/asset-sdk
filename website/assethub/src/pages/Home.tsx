import { Button, Divider, Select } from "antd";
// import assetHubAbi from "../abi/AssetHub.json";
// import erc20Abi from "../abi/IERC20.json";
// import { AssetHub, FeeAssetModule, TestToken, admin } from "../context/consts";
import { useEffect, useState } from "react";
import {
  Asset,
  AssetHubInfo,
  AssetList,
  useGetAssetHubs,
} from "@asset-protocol/react";
import { DefaultOptionType } from "antd/es/select";
import { useNavigate, useParams } from "react-router-dom";
import { useGoAsset } from "../utils/route";

export function Home() {
  const { goViewer, goCreate } = useGoAsset();
  const navigate = useNavigate();
  const { hub } = useParams();

  const [hubOptions, setHubOptions] = useState<DefaultOptionType[]>([]);
  const [hubInfo, setHubInfo] = useState<AssetHubInfo>();
  const { data, loading } = useGetAssetHubs();

  useEffect(() => {
    if (data) {
      setHubOptions(
        data?.map((hub) => ({ label: hub.name, value: hub.id })) || []
      );
      if (!hubInfo) {
        if (hub === "home") {
          setHubInfo(data[0]);
        } else {
          setHubInfo(data.find((h) => h.id === hub || h.name === hub));
        }
      } else if (hub !== "home" && hubInfo.id !== hub && hubInfo.name !== hub) {
        setHubInfo(data.find((h) => h.id === hub || h.name === hub));
      }
    }
  }, [data, hub, hubInfo]);

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
    goViewer(asset.hub, asset.assetId.toString());
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
          options={hubOptions}
          onChange={(value) => {
            const hub = hubOptions.find((h) => h.value === value);
            if (hub) {
              navigate("/" + hub.label);
            }
          }}
        ></Select>
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
        <Button onClick={() => goCreate()}>创建资产</Button>
      </div>
      <Divider className="my-2 bg-gray-300" />
      Assets List:
      {hubInfo?.id && (
        <AssetList
          query={{
            hub: hubInfo.id,
            first: 9999,
            fetchPolicy: "no-cache",
            orderBy: ["timestamp_DESC"],
            skipFunc: (args) => !args.hub,
          }}
          grid={{ column: 4, gutter: 12, xs: 2, sm: 3 }}
          onAssetClick={hanldeClickAsset}
          // itemClassName="w-[240px]"
        ></AssetList>
      )}
    </div>
  );
}
