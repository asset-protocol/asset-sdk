import { AssetHubConfig } from "../../core/plugin";
import AssetRichTextEditor from "./components/RichTextEditor";
import { TYPE_RICH_TEXT } from "./consts";

const richtextEditor = (config: AssetHubConfig) => {
  config.registerEditor({
    types: [{ value: TYPE_RICH_TEXT, label: "Rich Text" }],
    selector: (t) => t === TYPE_RICH_TEXT,
    editor: (props) => <AssetRichTextEditor {...props} />,
  });
};
export default richtextEditor;
