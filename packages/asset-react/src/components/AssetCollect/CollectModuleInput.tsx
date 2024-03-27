import { Select, Switch } from "antd";
import { AssetModule } from "../../core";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { ZeroAddress } from "ethers";
import { BytesLike } from "ethers";

export type CollectModuleInputProps = {
  value?: AssetModule;
  onChange?: (value?: AssetModule) => void;
  moudles?: CollectModuleItem[];
};

export type CollectModuleContentProps = {
  module: string;
  value?: AssetModule;
  onChange?: (v?: BytesLike) => void;
};

export type CollectModuleItem = {
  label: ReactNode;
  module: string;
  content: (props: CollectModuleContentProps) => ReactNode;
};

export function CollectModuleInput(props: CollectModuleInputProps) {
  const { value, onChange, moudles } = props;

  const [useCollect, setUseCollect] = useState(
    props.value && props.value.module !== ZeroAddress
  );

  const opts = useMemo(() => {
    return moudles?.map((m) => ({
      label: m.label,
      value: m.module,
    }));
  }, [moudles]);

  const [selectedModule, setSelectedModule] = useState<string>(
    value?.module ?? opts?.[0].value ?? ""
  );

  const Content = moudles?.find((m) => m.module === selectedModule)?.content;
  const handleDataChange = (data?: BytesLike) => {
    props.onChange?.(
      selectedModule
        ? {
            module: selectedModule,
            initData: data,
          }
        : undefined
    );
  };

  // useEffect(() => {
  //   if (!selectedModule) {
  //     setSelectedModule(moudles?.[0]?.module);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [moudles]);

  useEffect(() => {
    if (!useCollect) {
      onChange?.(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useCollect]);

  return (
    <div>
      <div className="flex justify-between">
        Collect Setting:
        <Switch value={useCollect} onChange={(v) => setUseCollect(v)} />
      </div>
      {useCollect && (
        <div className="px-4 pt-2 rounded-lg bg-gray-100">
          <div className="flex items-center">
            <span className="w-[64px]">Module</span>
            <Select
              style={{ width: 170 }}
              options={opts}
              value={selectedModule}
              onChange={(t) => setSelectedModule(t)}
            ></Select>
          </div>
          {Content && (
            <Content
              module={selectedModule}
              value={value}
              onChange={handleDataChange}
            />
          )}
        </div>
      )}
    </div>
  );
}
