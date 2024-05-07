import { Navigate, createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { AssetViewPage } from "../pages/asset/AssetViewPage";
import { AssetEditPage } from "../pages/asset/AssetEditPage";
import { AssetCreatePage } from "../pages/asset/AssetCreatePage";
import { Layerout } from "../pages/Layout";
import { DemoPage } from "../pages/asset/DemoPage";
import { AssetsPage } from "../pages/asset/AssetsPage";
import { CurationsPage } from "../pages/curation/CurationsPage";
import { CurationDetailPage } from "../pages/curation/CurationDetailPage";
import { CreatorPage } from "../pages/creator/CreatorPage";

const root = createBrowserRouter([
  {
    path: "/",
    element: <Layerout />,
    children: [
      {
        path: "",
        element: <Navigate to="/home" />,
      },
      {
        path: "demo",
        element: <DemoPage />,
      },
      {
        path: "assets",
        element: <AssetsPage />,
      },
      {
        path: "curations",
        children: [
          {
            path: "",
            element: <CurationsPage />,
          },
          {
            path: ":curationId",
            element: <CurationDetailPage />,
          },
        ],
      },
      {
        path: "creator",
        element: <CreatorPage />,
      },
      {
        path: ":hub",
        children: [
          {
            path: "",
            element: <Home />,
          },
          {
            path: "asset/create",
            element: <AssetCreatePage />,
          },
          {
            path: "asset/:assetId",
            element: <AssetViewPage />,
          },
          {
            path: "asset/:assetId/edit",
            element: <AssetEditPage />,
          },
        ],
      },
    ],
  },
]);

export default root;
