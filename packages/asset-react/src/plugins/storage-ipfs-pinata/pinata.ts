import { IStorage, UploadObject } from "../../core";
import { AssetHubConfig } from "../../core/plugin";

export const STORAGE_SCHEMA_IPFS = "ipfs";

export class PinataStorage implements IStorage {
  public readonly scheme = {
    name: STORAGE_SCHEMA_IPFS,
    label: 'IPFS'
  }

  constructor(private readonly jwtToken: string, private readonly gateway: string) { }

  async upload(args: UploadObject): Promise<string> {
    const formData = new FormData();
    if (typeof args.data === "string") {
      formData.append("file", new Blob([args.data]));
    } else {
      formData.append("file", args.data);
    }
    const metadata = JSON.stringify({
      name: args.name ?? new Date().getTime().toString(),
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);
    const res = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.jwtToken}`,
        },
        body: formData,
      }
    );
    if (!res.ok) {
      throw new Error("Failed to upload to pinata: " + res.statusText);
    }
    const resData = await res.json();
    return "ipfs://" + resData.IpfsHash;
  }

  getUrl(uri: string): string {
    uri = uri.replace("ipfs://", "");
    return `${this.gateway}/ipfs/${uri}`;
  }
}


export function PinataPlugin(jwtToken: string, gateway: string) {
  return (config: AssetHubConfig) => {
    config.registerStorage(new PinataStorage(jwtToken, gateway));
  }
}