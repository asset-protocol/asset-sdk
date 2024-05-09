import { ReactNode } from "react";
import { IEditorProvider } from "./editor";
import { IStorage } from "./storage";
import { IViewerProvider } from "./viewer";
import { ICollectModule } from "./collect";

export type AssetHubPlugin = (config: AssetHubConfig) => ((() => void) | void);

export class AssetHubConfig {
  private _storages: { [key: string]: IStorage } = {}
  private _editorProviders: { [key: string]: IEditorProvider[] } = {}
  private _viewerProviders: { [key: string]: IViewerProvider[] } = {}
  private _configProviders: ((props: { children: ReactNode }) => ReactNode)[] = []
  private _collectModules: ICollectModule[] = [];

  public get editorProviders() {
    return this._editorProviders;
  }

  public get viewerProviders() {
    return this._viewerProviders;
  }

  public get storages() {
    return this._storages;
  }

  public get configProviders() {
    return this._configProviders;
  }

  public get collectModules() {
    return this._collectModules;
  }

  registerStorage(storage: IStorage) {
    const stoarges = this._storages;
    const pre = stoarges[storage.scheme.name];
    stoarges[storage.scheme.name] = storage;
    if (pre) {
      return () => stoarges[storage.scheme.name] = pre;
    } else {
      return () => delete stoarges[storage.scheme.name];
    }
  }

  public registerEditor(provider: IEditorProvider) {
    provider.types.forEach(t => {
      if (this._editorProviders[t.value]) {
        this._editorProviders[t.value].push(provider);
      } else {
        this._editorProviders[t.value] = [provider];
      }
    })
    return this;
  }

  public registerViewer(type: string, provider: IViewerProvider) {
    const providers = this._viewerProviders;
    if (providers[type]) {
      providers[type].push(provider);
    } else {
      providers[type] = [provider];
    }
    return () => { providers[type].splice(providers[type].indexOf(provider), 1) };
  }

  public registerConfigProvider(provider: (props: { children: ReactNode }) => ReactNode) {
    const providers = this._configProviders;
    providers.push(provider);
    return () => { providers.splice(providers.indexOf(provider), 1) };
  }

  public registerCollectModule(provider: ICollectModule) {
    const collectModules = this._collectModules;
    collectModules.push(provider);
    return () => {
      collectModules.splice(collectModules.indexOf(provider), 1);
    };
  }

  public use(plugin: AssetHubPlugin) {
    return plugin(this);
  }
}

export const globalConfig = new AssetHubConfig();
