import { ReactNode } from "react";
import { IEditorProvider } from "./editor";
import { IStorage } from "./storage";
import { IViewerProvider } from "./viewer";

export interface IAssetHub {
  storages: { [key: string]: IStorage };
  editorProviders: { [key: string]: IEditorProvider[] };
  viewerProviders: { [key: string]: IViewerProvider[] };
  configProviders: ((props: { children: ReactNode }) => ReactNode)[];
}

export type AssetHubPlugin = (config: AssetHubConfig) => void;

export class AssetHubConfig {
  private _storages: { [key: string]: IStorage } = {}
  private _editorProviders: { [key: string]: IEditorProvider[] } = {}
  private _viewerProviders: { [key: string]: IViewerProvider[] } = {}
  private _configProviders: ((props: { children: ReactNode }) => ReactNode)[] = []

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
  }

  public registerViewer(type: string, provider: IViewerProvider) {
    if (this._viewerProviders[type]) {
      this._viewerProviders[type].push(provider);
    } else {
      this._viewerProviders[type] = [provider];
    }
  }

  public registerConfigProvider(provider: (props: { children: ReactNode }) => ReactNode) {
    this._configProviders.push(provider);
  }

  public build(): IAssetHub {
    return this;
  }
}
