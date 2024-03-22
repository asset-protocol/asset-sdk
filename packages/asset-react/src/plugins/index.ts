import { AssetHubConfig } from '../core';
import defaultPlugin from './asset-default';
import audioPlugin from './asset-audio';
import externalLinkPlugin from './asset-embed-video';
import imagePlugin from './asset-image';
import markdownPlugin from './asset-markdown';
import richtextPlugin from './asset-richtext';
import videoPlugin from './asset-video';

export { default as audioPlugin, TYPE_AUDIO } from './asset-audio';
export { default as defaultPlugin } from './asset-default';
export { default as embedVideoPlugin, TYPE_EMBED_VIDEO as TYPE_EXTERNAL_LINK } from './asset-embed-video';
export { default as imagePlugin, TYPE_IMAGE } from './asset-image';
export { default as markdownPlugin, TYPE_MARKDOWN } from './asset-markdown';
export { default as videoPlugin, TYPE_VIDEO, TYPE_YOUTUBE } from './asset-video';
export { default as richtextPlugin, TYPE_RICH_TEXT } from './asset-richtext';

export const allAssetTypePlugin = (config: AssetHubConfig) => {
  defaultPlugin(config);
  audioPlugin(config);
  externalLinkPlugin(config);
  imagePlugin(config);
  markdownPlugin(config);
  videoPlugin(config);
  richtextPlugin(config);
}

export { default as ipfsPinataPlugin, STORAGE_SCHEMA_IPFS } from './storage-ipfs-pinata';
export { default as arwaveStoragePlugin } from './storage-arwave';
export { default as arwaveAkordStoragePlugin } from './storage-arwave-akord';