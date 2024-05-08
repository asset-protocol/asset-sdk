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
    let length = -1;
    if (providers[type]) {
      length = providers[type].push(provider);
    } else {
      providers[type] = [provider];
      length = 0;
    }
    return () => { providers[type].splice(length - 1, 1) };
  }

  public registerConfigProvider(provider: (props: { children: ReactNode }) => ReactNode) {
    const length = this._configProviders.push(provider);
    return () => { this._configProviders.splice(length - 1, 1) };
  }

  public registerCollectModule(provider: ICollectModule) {
    const length = this._collectModules.push(provider);
    return () => { this._collectModules.splice(length - 1, 1) };
  }

  public use(plugin: AssetHubPlugin) {
    return plugin(this);
  }
}

export const globalConfig = new AssetHubConfig();
