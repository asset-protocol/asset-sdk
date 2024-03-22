import { Asset } from "../client/core";
import { ReactNode } from "react";

export type IViewerProps = {
  value: Asset;
  [key: string]: unknown;
};

export type IViewer = (props: IViewerProps) => ReactNode;

export type IViewerProvider = {
  selector: (value: Asset) => boolean;
  viewer: IViewer;
}