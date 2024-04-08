import { Form, Select, Switch } from "antd";
import { ReactNode, useMemo } from "react";
import { AssetModule } from "../../core";
import { BytesLike, ZeroAddress } from "ethers";
import { useAssetHub } from "../../context";

export type CollectModuleInputProps = {
  value?: AssetModule;
  onChange?: (v?: AssetModule) => void;
};

export type CollectModuleContentProps = {
  module: string;
  value?: BytesLike;
  onChange?: (v?: BytesLike) => void;
};

export type CollectModuleItem = {
  label: ReactNode;
  module: string;
  content: ReactNode;
};

export function CollectModuleInput() {
  const { ctx } = useAssetHub();
  const opts = useMemo(() => {
    return ctx.collectModules.map((m) => ({
      label: m.label,
      value: m.moduleContract,
    }));
  }, [ctx]);
  return (
    <>
      <Form.Item
        className="w-full mb-2 flex-1"
        label="Collect Setting"
        name="useCollect"
        wrapperCol={{ flex: 1, className: "text-right" }}
      >
        <Switch />
      </Form.Item>
      <Form.Item noStyle dependencies={["useCollect"]}>
        {({ getFieldValue }) =>
          getFieldValue("useCollect") && (
            <>
              <Form.Item name={["collectModule", "module"]} label="Collect Module" className="mb-2">
                <Select style={{ width: 170 }} options={opts}></Select>
              </Form.Item>
              <Form.Item noStyle dependencies={[["collectModule", "module"]]}>
                {({ getFieldValue, setFieldValue }) => {
                  const module = getFieldValue(["collectModule", "module"]);
                  if (!module || module === ZeroAddress) {
                    setFieldValue(["collectModule", "module"], opts[0].value);
                    return;
                  }
                  const content = ctx.collectModules.find((m) => m.moduleContract === module)?.inputNode;
                  return (
                    content && (
                      <Form.Item name={["collectModule", "initData"]} className="mb-2 ml- bg-gray-50 rounded-md w-full px-2">
                        {content}
                      </Form.Item>
                    )
                  );
                }}
              </Form.Item>
            </>
          )
        }
      </Form.Item>
    </>
  );
}
