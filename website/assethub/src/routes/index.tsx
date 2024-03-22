import { Navigate, createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { AssetViewPage } from "../pages/asset/AssetViewPage";
import { AssetEditPage } from "../pages/asset/AssetEditPage";
import { AssetCreatePage } from "../pages/asset/AssetCreatePage";
import { Layerout } from "../pages/Layout";
import { DemoPage } from "../pages/asset/DemoPage";

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
