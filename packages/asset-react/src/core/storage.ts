export type UploadObject = {
  name?: string
  data: string | Blob;
  onProgress?: (percent: number) => void;
}

export type StorageScheme = string;

export interface IStorage {
  scheme: { name: string, label: string };
  upload(args: UploadObject): Promise<string>;
  getUrl(uri: string): string;
}