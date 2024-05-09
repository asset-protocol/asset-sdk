import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button, Dropdown, Layout, Menu, MenuProps } from "antd";
import { Outlet } from "react-router-dom";
import { useGoAsset, useGoCuration, useGoHome, useGoHub } from "../utils/route";
import { useState } from "react";
import { Content, Header } from "antd/es/layout/layout";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import { CreateHubModal } from "./hub/CreateHub";

export function Layerout() {
  const { goAssets, goCreate: goCreateAsset } = useGoAsset();
  const { goHub } = useGoHub();
  const { goCurations, goCreate: goCreateCuration } = useGoCuration();
  const goHome = useGoHome();

  const [createHubModalVisible, setCreateHubModalVisible] = useState(false);

  const menuItems: MenuItemType[] = [
    {
      key: "assets",
      label: "Assets",
      onClick: () => {
        goAssets();
      },
    },
    {
      key: "curations",
      label: "Curations",
      onClick: () => {
        goCurations();
      },
    },
  ];

  const createMenu: MenuProps = {
    items: [
      {
        key: "asset",
        label: "Create Asset",
        onClick: () => {
          goCreateAsset();
        },
      },
      {
        key: "curation",
        label: "Create Curation",
        onClick: () => {
          goCreateCuration();
        },
      },
      {
        key: "hub",
        label: "Create Hub",
        onClick: () => {
          setCreateHubModalVisible(true);
        },
      },
    ],
  };

  return (
    <Layout className="bg-transparent">
      <Header className="flex items-center px-2 gap-2">
        <div
          className="flex items-end cursor-pointer"
          onClick={() => {
            goHome();
          }}
        >
          <div className="text-xl font-bold">CreatorNetwork</div>
          {/* <div className="ml-2 text-base font-normal">AssetHub</div> */}
        </div>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
        <Dropdown
          menu={createMenu}
          trigger={["click"]}
          placement="bottom"
        >
          <Button type="primary">Create</Button>
        </Dropdown>
        <ConnectButton />
      </Header>
      <Content>
        <div>
          <Outlet />
        </div>
      </Content>
      <CreateHubModal
        onCancel={() => setCreateHubModalVisible(false)}
        open={createHubModalVisible}
        onFinish={(hub) => {
          setCreateHubModalVisible(false);
          goHub(hub.name);
        }}
      />
    </Layout>
  );
}
