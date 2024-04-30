import { EmbedBlot } from "parchment";
import { replaceUri } from "../../../lib/utils";

const ATTRIBUTES = ["height", "width"];

class Video extends EmbedBlot {
  static blotName = "video";
  static className = "ql-video";
  static tagName = "VIDEO";

  static create(value: string) {
    const node = super.create(value) as HTMLVideoElement;
    node.setAttribute("frameborder", "0");
    node.setAttribute("allowfullscreen", "true");
    node.setAttribute("src", this.sanitize(value));
    node.setAttribute("orgin-src", value);
    node.setAttribute("controls", "true");
    return node;
  }

  static formats(domNode: Element) {
    return ATTRIBUTES.reduce(
      (formats: Record<string, string | null>, attribute) => {
        if (domNode.hasAttribute(attribute)) {
          formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
      },
      {}
    );
  }

  static sanitize(url: string) {
    return replaceUri(url) ?? url;
  }

  static value(domNode: Element) {
    return domNode.getAttribute("orgin-src");
  }

  declare domNode: HTMLVideoElement;

  format(name: string, value: string) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

export default Video;
