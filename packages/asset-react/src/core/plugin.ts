import { ReactNode } from "react";
import { IEditorProvider } from "./editor";
import { IStorage } from "./storage";
import { IViewerProvider } from "./viewer";
import { ICollectModule } from "./collect";

export type AssetHubPlugin = (config: AssetHubConfig) => void;

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

  registerStorage(storage: IStorage): AssetHubConfig {
    this._storages[storage.scheme.name] = storage;
    return this;
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
    if (this._viewerProviders[type]) {
      this._viewerProviders[type].push(provider);
    } else {
      this._viewerProviders[type] = [provider];
    }
    return this;
  }

  public registerConfigProvider(provider: (props: { children: ReactNode }) => ReactNode) {
    this._configProviders.push(provider);
    return this;
  }

  public registerCollectModule(provider: ICollectModule) {
    this._collectModules.push(provider);
    return this;
  }

  public use(plugin: AssetHubPlugin) {
    plugin(this);
    return this;
  }
}
