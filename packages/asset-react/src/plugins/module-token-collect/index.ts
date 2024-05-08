import { AssetHubConfig } from '../../core';
import { TokenCollectModule, TokenCollectModuleOptions } from './TokenCollectModule';

export default function TokenCollectModulePlugin(opts: TokenCollectModuleOptions) {
  return (config: AssetHubConfig) => {
    return config.registerCollectModule(TokenCollectModule(opts));
  };
}
export * from './TokenCollectModule';
export * from './components/TokenCollectModuleItem'