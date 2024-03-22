import { Asset } from "../../client/core";
import { useAssetHub } from "../../context";
import { AssetMetadata } from "../../core";
import { UpdateAssetInput } from "../../hook/assethub";

export type AssetFieldType = {
  type: string;
  name: string;
  content: string;
  image?: string;
  description?: string;
  tags?: string[];
  collectModule?: { module: string; data?: string };
};

export function useSaveAssetMetadata() {
  const { storage } = useAssetHub();
  return async (values: AssetMetadata, asset?: Asset): Promise<UpdateAssetInput | undefined> => {
    if (values.image?.startsWith("blob:")) {
      const data = await fetch(values.image).then((res) => res.blob());
      const imageUrl = await storage.upload({ data });
      values.image = imageUrl;
    }
    const metadata = JSON.stringify(values);
    if (asset?.metadata === metadata) {
      return;
    }
    const metadataURI = await storage.upload({
      data: metadata,
    });
    return {
      contentURI: metadataURI,
    }
  }
}