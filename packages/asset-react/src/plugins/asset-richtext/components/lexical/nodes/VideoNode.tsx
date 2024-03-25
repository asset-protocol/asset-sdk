import {
  $applyNodeReplacement,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  DecoratorNode,
  EditorConfig,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { VideoComponent, VideoComponentProps } from "./VideoComponent";
import ReactDOM from "react-dom";

export interface VideoPayload {
  src: string;
  width?: string | number;
  aspectRatio?: string;
  key?: NodeKey;
}

export type SerializedVideoNode = Spread<
  {
    src: string;
    width?: string | number;
    aspectRatio?: string;
  },
  SerializedLexicalNode
>;

export class VideoNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __width?: string | number;
  __aspectRatio?: string;
  static preRedner?: (props: VideoComponentProps) => void;
  static onConvertElement?: (
    props: VideoComponentProps,
    preNode: VideoNode
  ) => void;

  static getType(): string {
    return "video";
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode({
      src: node.__src,
      width: node.__width,
      key: node.__key,
      aspectRatio: node.__aspectRatio,
    });
  }

  static importJSON(serializedNode: SerializedVideoNode): VideoNode {
    const { width, src, aspectRatio } = serializedNode;
    const node = $createVideoNode({
      src,
      width,
      aspectRatio,
    });
    return node;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertVideoElement,
        priority: 0,
      }),
    };
  }

  constructor({ src, width, key }: VideoPayload) {
    super(key);
    this.__src = src;
    this.__width = width;
  }

  getSrc() {
    return this.__src;
  }

  getWidth() {
    return this.__width;
  }

  setWidth(w?: string | number) {
    const writable = this.getWritable();
    writable.__width = w;
  }

  setAspectRatio(aspectRatio?: string) {
    const writable = this.getWritable();
    writable.__aspectRatio = aspectRatio;
  }

  exportJSON(): SerializedVideoNode {
    return {
      src: this.getSrc(),
      width: this.__width === "inherit" ? 0 : this.getWidth(),
      type: "video",
      version: 1,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.style.width = "100%";
    ReactDOM.render(this.createVideoComponent(true), element);
    return { element };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.video;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate() {
    return this.createVideoComponent();
  }

  private createVideoComponent(readonly?: boolean) {
    const props: VideoComponentProps = {
      src: this.getSrc(),
      width: this.getWidth(),
      aspectRatio: this.__aspectRatio,
      nodeKey: this.getKey(),
      readonly,
    };
    if (VideoNode.preRedner) {
      VideoNode.preRedner(props);
    }
    return <VideoComponent {...props}></VideoComponent>;
  }
}

export function $createVideoNode(payload: VideoPayload): VideoNode {
  const node = new VideoNode(payload);
  return $applyNodeReplacement(node);
}

function convertVideoElement(domNode: Node): null | DOMConversionOutput {
  const video = domNode as HTMLVideoElement;
  if (video.src.startsWith("file:///")) {
    return null;
  }
  const payload: VideoPayload = {
    src: video.src,
    width: video.width,
  };
  const node = $createVideoNode(payload);
  VideoNode.onConvertElement?.({ ...payload, nodeKey: node.getKey() }, node);
  return { node };
}
