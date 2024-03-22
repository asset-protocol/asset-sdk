export type AssetMetadata = {
  type: string;
  name: string;
  content: string;
  description?: string;
  image?: string;
  tags?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extra?: { [key in string]: any };
}
