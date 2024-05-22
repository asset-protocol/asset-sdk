import { useEffect, useState } from "react";
import { CurationCreateModal } from "./CurationCreateModal";
import { useSearchParams } from "react-router-dom";
import {
  Curation,
  fromNow,
  replaceUri,
  useGetCurations,
} from "@asset-protocol/react";
import { Button, Image, List, Skeleton } from "antd";
import { useGoCreator, useGoCuration } from "../../utils/route";

export function CurationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { goCuration } = useGoCuration();
  const { goCreator } = useGoCreator();

  const [createIsOpen, setCreateIsOpen] = useState(
    searchParams.get("create") === "true"
  );

  const { data, loading } = useGetCurations();

  useEffect(() => {
    const create = searchParams.get("create");
    if (create === "true") {
      setCreateIsOpen(true);
    } else {
      setCreateIsOpen(false);
    }
  }, [searchParams]);

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="flex justify-between items-center gap-2">
        <h1>Curations</h1>
        <Button type="primary" onClick={goCreator}>
          Creator Center
        </Button>
      </div>
      <List
        dataSource={data}
        grid={{ column: 4, gutter: 12, xs: 2, sm: 3 }}
        rowKey={(item) => item.id}
        loading={loading}
        itemLayout="horizontal"
        renderItem={(item) => (
          <List.Item
            colStyle={{ display: "flex", height: "100%" }}
            className="w-full"
          >
            <CurationItem curation={item} key={item.id} />
          </List.Item>
        )}
      ></List>
      <CurationCreateModal
        open={createIsOpen}
        onFinish={(curationId: bigint) => {
          setCreateIsOpen(false);
          goCuration(curationId.toString());
        }}
        onCancel={() => {
          setCreateIsOpen(false);
          setSearchParams({});
        }}
      />
    </div>
  );
}

export function CurationItem({ curation }: { curation: Curation }) {
  const { goCuration } = useGoCuration();
  const openCuration = () => {
    goCuration(curation.id);
  };

  return (
    <div className="shadow-md rounded overflow-hidden flex flex-col w-full h-full">
      {
        <Image
          title="asset image"
          preview={false}
          className="aspect-[2/1] cursor-pointer object-cover w-full"
          src={replaceUri(curation.image)}
          placeholder={
            <Skeleton.Image
              active
              rootClassName="!w-full !aspect-[2/1]"
              className="!w-full !h-full"
            />
          }
          onClick={openCuration}
        ></Image>
      }
      {!curation.name && (
        <div
          className="text-3xl aspect-[2/1] flex items-center justify-center bg-gray-200 font-bold"
          onClick={openCuration}
        >
          No Metadata
        </div>
      )}
      <div className="py-4 px-2 flex-1 flex flex-col gap-2">
        <div className="text-lg font-bold">
          <div className="flex">
            <div
              className="flex-1 cursor-pointer line-clamp-1 hover:underline"
              title={curation.name}
              onClick={openCuration}
            >
              {curation.name ?? "---"}
            </div>
          </div>
        </div>
        <div className="line-clamp-1">{curation.description}</div>
      </div>
      <div className="flex items-center justify-between mb-2 px-2">
        {curation.expiry > 0 && <div className="text-gray-500">
          End at:  {new Date(curation.expiry * 1000).toLocaleString()}
        </div>}
      </div>
    </div>
  );
}
