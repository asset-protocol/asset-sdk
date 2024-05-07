import { Asset, useSearchAssets } from "@asset-protocol/react";
import { Input, Modal, ModalProps, Table, TableColumnsType } from "antd";
import { useMemo, useState } from "react";

export type AssetSelectorProps = {
  value?: Asset[];
  onChange?: (assets: Asset[]) => void;
};

export function AssetSelector(props: AssetSelectorProps) {
  const [keyWord, setKeyWord] = useState("");
  const { data, loading } = useSearchAssets(keyWord);
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);

  const columns: TableColumnsType<Asset> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Author",
      dataIndex: "publisher",
    },
  ];
  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: Asset[]) => {
      props.onChange?.(selectedRows);
      setSelectedAssets(selectedRows);
    },
  };

  const dataSource = useMemo(() => {
    if (data) {
      const newData = data.filter(
        (a) => selectedAssets.findIndex((s) => s.id === a.id) === -1
      );
      return [...selectedAssets, ...newData];
    }
    return selectedAssets;
  }, [data, selectedAssets]);

  return (
    <div>
      <div className="flex items-center my-2">
        <div className="mr-2">Key Word:</div>
        <Input
          className="flex-1"
          placeholder="Search by name or author"
          onChange={(e) => setKeyWord(e.target.value)}
        />
      </div>
      <Table<Asset>
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSource}
        rowKey={(asset) => asset.id}
        loading={loading}
      />
    </div>
  );
}
export type AssetSelectorModalProps = Omit<ModalProps, "children" | "onOk"> & {
  onFinish?: (assets: Asset[]) => void;
};
export function AssetSelectorModal(props: AssetSelectorModalProps) {
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);

  const { onFinish, ...modalProps } = props;

  return (
    <Modal {...modalProps} width={800} onOk={() => onFinish?.(selectedAssets)}>
      <AssetSelector
        value={selectedAssets}
        onChange={(assets) => setSelectedAssets(assets)}
      />
    </Modal>
  );
}
