/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from "lexical";

import { $applyNodeReplacement, createEditor, DecoratorNode } from "lexical";
import * as React from "react";
import { Suspense } from "react";

const ImageComponent = React.lazy(() => import("./ImageComponent"));

export interface ImagePayload {
  altText: string;
  caption?: LexicalEditor;
  height?: string | number;
  key?: NodeKey;
  showCaption?: boolean;
  src: string;
  width?: string | number;
  captionsEnabled?: boolean;
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  const img = domNode as HTMLImageElement;
  if (img.src.startsWith("file:///")) {
    return null;
  }
  const payload = {
    altText: img.alt,
    src: img.src,
    width: img.width,
    height: img.height,
  };
  const node = $createImageNode(payload);
  ImageNode.onConvertImageElement?.(payload, node);
  return { node };
}

export type SerializedImageNode = Spread<
  {
    altText: string;
    caption: SerializedEditor;
    height?: string | number;
    showCaption: boolean;
    src: string;
    width?: string | number;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: string | number;
  __height: string | number;
  __showCaption: boolean;
  __caption: LexicalEditor;
  // Captions cannot yet be used within editor cells
  __captionsEnabled: boolean;
  static preRender?: (src: string) => string;
  static onConvertImageElement?: (
    payload: ImagePayload,
    preNode: LexicalNode
  ) => void;
  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__captionsEnabled,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, caption, src, showCaption } =
      serializedNode;
    const node = $createImageNode({
      altText,
      height,
      showCaption,
      src,
      width,
    });
    const nestedEditor = node.__caption;
    const editorState = nestedEditor.parseEditorState(caption.editorState);
    if (!editorState.isEmpty()) {
      nestedEditor.setEditorState(editorState);
    }
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    let src = this.__src;
    if (ImageNode.preRender) {
      src = ImageNode.preRender(src);
    }
    element.setAttribute("src", src);
    element.setAttribute("alt", this.__altText);
    element.setAttribute("width", this.__width.toString());
    element.setAttribute("height", this.__height.toString());
    element.style.maxWidth = "100%";
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    width?: string | number,
    height?: string | number,
    showCaption?: boolean,
    caption?: LexicalEditor,
    captionsEnabled?: boolean,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
    this.__showCaption = showCaption || false;
    this.__caption = caption || createEditor();
    this.__captionsEnabled = captionsEnabled || captionsEnabled === undefined;
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      caption: this.__caption.toJSON(),
      height: this.__height === "inherit" ? 0 : this.__height,
      showCaption: this.__showCaption,
      src: this.getSrc(),
      type: "image",
      version: 1,
      width: this.__width === "inherit" ? 0 : this.__width,
    };
  }

  setWidthAndHeight(width: string | number, height: string | number): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  setShowCaption(showCaption: boolean): void {
    const writable = this.getWritable();
    writable.__showCaption = showCaption;
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  decorate(): JSX.Element {
    let src = this.__src;
    if (ImageNode.preRender) {
      src = ImageNode.preRender(src);
    }
    return (
      <Suspense fallback={null}>
        <ImageComponent
          src={src}
          altText={this.__altText}
          width={this.__width}
          height={this.__height}
          nodeKey={this.getKey()}
          showCaption={this.__showCaption}
          caption={this.__caption}
          captionsEnabled={this.__captionsEnabled}
          resizable={true}
        />
      </Suspense>
    );
  }
}

export function $createImageNode(payload: ImagePayload): ImageNode {
  const {
    altText,
    height,
    captionsEnabled,
    src,
    width,
    showCaption,
    caption,
    key,
  } = payload;
  const node = new ImageNode(
    src,
    altText,
    width,
    height,
    showCaption,
    caption,
    captionsEnabled,
    key
  );
  return $applyNodeReplacement(node);
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}
