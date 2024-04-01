import { Form, Select, Switch } from "antd";
import { ReactNode, useMemo } from "react";
import { AssetModule } from "../../core";
import { BytesLike } from "ethers";
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
        className="flex justify-between"
        label="Collect Setting"
        name="useCollect"
      >
        <Switch />
      </Form.Item>
      <Form.Item noStyle dependencies={["useCollect"]}>
        {({ getFieldValue }) =>
          getFieldValue("useCollect") && (
            <>
              <Form.Item name={["collectModule", "module"]}>
                <Select style={{ width: 170 }} options={opts}></Select>
              </Form.Item>
              <Form.Item noStyle dependencies={[["collectModule", "module"]]}>
                {({ getFieldValue }) => {
                  const content = ctx.collectModules.find(
                    (m) =>
                      m.moduleContract === getFieldValue(["collectModule", "module"])
                  )?.inputNode;
                  return (
                    content && (
                      <Form.Item name={["collectModule", "initData"]}>
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
