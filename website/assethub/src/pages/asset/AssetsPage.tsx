import { Asset, AssetList, useGetAssetTagNames } from "@asset-protocol/react";
import { useGoAsset } from "../../utils/route";
import { Button, ButtonProps } from "antd";
import { useEffect, useMemo, useState, MouseEvent } from "react";
import { useSearchParams } from "react-router-dom";

export type TagItemProps = Omit<ButtonProps, "onClick" | "onChange"> & {
  onChange?: (check: boolean, e: MouseEvent) => void;
  checked?: boolean;
};

export function TagItem(props: TagItemProps) {
  const { onChange, checked, ...rest } = props;
  return (
    <Button
      type={checked ? "primary" : "default"}
      {...rest}
      onClick={(e) => {
        onChange?.(!checked, e);
      }}
    />
  );
}

export type TagGroupProps = {
  tags?: Array<{ label: string; value: string }>;
  selectedTags?: string[];
  onChange?: (tags: string[]) => void;
};

export function TagGroup(props: TagGroupProps) {
  const { tags, selectedTags, onChange } = props;

  return (
    <div className="flex flex-wrap gap-2 my-2">
      {tags &&
        tags.map((t) => (
          <TagItem
            key={t.value}
            checked={selectedTags?.includes(t.value)}
            onChange={(check, e) => {
              if (e.ctrlKey) {
                onChange?.(
                  check
                    ? [...(selectedTags ?? []), t.value]
                    : selectedTags?.filter((s) => s !== t.value) ?? []
                );
              } else {
                onChange?.(check ? [t.value] : []);
              }
            }}
          >
            {t.label}
          </TagItem>
        ))}
    </div>
  );
}

export function AssetsPage() {
  const { goViewer } = useGoAsset();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data } = useGetAssetTagNames(undefined, 20);
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tags = searchParams.get("tags");
    return tags ? tags.split(",") : [];
  });

  const tags = useMemo(
    () => data?.map((t) => ({ label: t.name, value: t.name })),
    [data]
  );

  useEffect(() => {
    if (selectedTags.length > 0) {
      setSearchParams({ ...searchParams, tags: selectedTags.join(",") });
    } else {
      searchParams.delete("tags");
      setSearchParams({ ...searchParams });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags]);

  useEffect(() => {
    if (selectedTags.join(",") === searchParams.get("tags")) {
      return;
    }
    setSelectedTags(() => {
      const tags = searchParams.get("tags");
      return tags ? tags.split(",") : [];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const hanldeClickAsset = (asset: Asset) => {
    goViewer(asset.hub, asset.assetId.toString());
  };

  return (
    <div className="max-w-[1080px] m-auto">
      <h1 className="text-3xl font-bold mb-4">Assets</h1>
      <div className="flex items-center mb-4">
        <span className="mr-2">Filter by tags(top 20):</span>
        <TagGroup
          tags={tags}
          selectedTags={selectedTags}
          onChange={(tags) => setSelectedTags(tags)}
        ></TagGroup>
      </div>
      <AssetList
        grid={{ column: 4, gutter: 12, xs: 2, sm: 3 }}
        onAssetClick={hanldeClickAsset}
        query={{
          first: 9999,
          tags: selectedTags.map((t) => t.toLowerCase()),
          fetchPolicy: "no-cache",
          orderBy: ["timestamp_DESC"],
        }}
        // itemClassName="w-[240px]"
      ></AssetList>
    </div>
  );
}
