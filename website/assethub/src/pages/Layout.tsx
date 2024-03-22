import { useAssetHub } from "@asset-protocol/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Divider } from "antd";
import { Outlet, useParams } from "react-router-dom";
import { useGoHome } from "../utils/route";
import { useEffect } from "react";

export function Layerout() {
  const { hubInfo, changeHub } = useAssetHub();
  const goHome = useGoHome();
  const { hub } = useParams();

  useEffect(() => {
    if (hub) {
      changeHub(hub);
    }
  }, [changeHub, hub]);

  return (
    <div>
      <div className="flex items-end px-2">
        <div
          className="flex items-end cursor-pointer"
          onClick={() => {
            goHome();
          }}
        >
          <div className="text-xl font-bold">{hubInfo?.name}</div>
          {/* <div className="ml-2 text-base font-normal">AssetHub</div> */}
        </div>
        <div className="flex-1"></div>
        <ConnectButton />
      </div>
      <Divider className="bg-gray-300 mt-3 mb-0" />
      <div className="m-auto">
        <Outlet />
      </div>
    </div>
  );
}
