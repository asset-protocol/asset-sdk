import { useEffect, useState } from "react";
import "./markdown-viwer.css";
import Vditor from "vditor";
import React from "react";
import { useReplaceUri } from "../../../lib/utils";
import { Asset } from "../../../client/core";
import { AssetViewerWithHeader } from "../../../components";

export default function MarkdownViewer({ value }: { value: Asset }) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [vd, setVd] = useState<Vditor>();

  const replaceUri = useReplaceUri();

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    Vditor.preview(editorRef.current, value.normalizedMetadata?.content ?? "", {
      mode: "light",
      anchor: 1,
      markdown: {},
      transform: (html) => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, "text/html");
        const image = dom.getElementsByTagName("img");
        for (let i = 0; i < image.length; i++) {
          image[i].src = replaceUri(image[i].src)!;
        }
        const audios = dom.getElementsByTagName("audio");
        for (let i = 0; i < audios.length; i++) {
          audios[i].src = replaceUri(audios[i].src)!;
        }
        const videos = dom.getElementsByTagName("video");
        for (let i = 0; i < videos.length; i++) {
          videos[i].src = replaceUri(videos[i].src)!;
        }
        const links = dom.getElementsByTagName("a");
        for (let i = 0; i < links.length; i++) {
          links[i].href = replaceUri(links[i].href)!;
        }
        const ser = new XMLSerializer();
        return ser.serializeToString(dom);
      },
    });
    // const vditor = new Vditor(editorRef.current, {
    //   mode: "ir",
    //   after: () => {
    //     vditor.setValue(value.normalizedMetadata?.content ?? "");
    //     setVd(vditor);
    //     // const evt = document.createEvent("Event");
    //     // evt.initEvent("click", true, true);
    //     // if (vditor.vditor.toolbar) {
    //     //   vditor.vditor.toolbar.elements?.preview.firstElementChild?.dispatchEvent(
    //     //     evt
    //     //   );
    //     // }
    //     vditor.disabled();
    //   },
    //   toolbar: [],
    //   toolbarConfig: {
    //     pin: true,
    //     hide: true,
    //   },
    //   outline: {
    //     enable: true,
    //     position: "right",
    //   },
    //   image: {
    //     isPreview: true,
    //     preview: (e) => {
    //       console.log("md image preview", e);
    //       const image = e.getElementsByTagName("img");
    //       for (let i = 0; i < image.length; i++) {
    //         image[i].src = replaceUri(image[i].src)!;
    //       }
    //       const audios = e.getElementsByTagName("audio");
    //       for (let i = 0; i < audios.length; i++) {
    //         audios[i].src = replaceUri(audios[i].src)!;
    //       }
    //       const videos = e.getElementsByTagName("video");
    //       for (let i = 0; i < videos.length; i++) {
    //         videos[i].src = replaceUri(videos[i].src)!;
    //       }
    //       const links = e.getElementsByTagName("a");
    //       for (let i = 0; i < links.length; i++) {
    //         links[i].href = replaceUri(links[i].href)!;
    //       }
    //     },
    //   },
    //   preview: {
    //     actions: [],
    //     delay: 0,
    //     maxWidth: undefined,
    //     markdown: {
    //       gfmAutoLink: true,
    //     },
    //     parse: (e) => {
    //       const image = e.getElementsByTagName("img");
    //       for (let i = 0; i < image.length; i++) {
    //         image[i].src = replaceUri(image[i].src)!;
    //       }
    //       const audios = e.getElementsByTagName("audio");
    //       for (let i = 0; i < audios.length; i++) {
    //         audios[i].src = replaceUri(audios[i].src)!;
    //       }
    //       const videos = e.getElementsByTagName("video");
    //       for (let i = 0; i < videos.length; i++) {
    //         videos[i].src = replaceUri(videos[i].src)!;
    //       }
    //       const links = e.getElementsByTagName("a");
    //       for (let i = 0; i < links.length; i++) {
    //         links[i].href = replaceUri(links[i].href)!;
    //       }
    //     },
    //   },
    //   cache: {
    //     id: "ah-md-viewer-cache",
    //   },
    // });
    // Clear the effect
    return () => {
      vd?.destroy();
      setVd(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-[1080px] mx-auto">
      <AssetViewerWithHeader></AssetViewerWithHeader>
      <div ref={editorRef}></div>
    </div>
  );
}
