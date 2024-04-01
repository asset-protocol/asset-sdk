import "./App.css";
import { RouterProvider } from "react-router-dom";
import root from "./routes";
import { AssetHub } from "./assethub/AssetHub";

function App() {
  return (
    <AssetHub>
      <RouterProvider router={root}></RouterProvider>
    </AssetHub>
  );
}

export default App;
