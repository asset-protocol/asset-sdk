import { useEffect, useState } from "react";
// import "./markdown-viwer.css";
import Vditor from "deschool-vditor";
import React from "react";
import { useReplaceUri } from "../../../lib/utils";
import { Asset } from "../../../client/core";
import { AssetViewerHeader } from "../../../components";

export default function MarkdownViewer({ value }: { value: Asset }) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [vd, setVd] = useState<Vditor>();

  const replaceUri = useReplaceUri();

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    Vditor.preview(editorRef.current, value.content ?? "", {
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
    return () => {
      vd?.destroy();
      setVd(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-[1080px] mx-auto">
      <AssetViewerHeader></AssetViewerHeader>
      <div ref={editorRef}></div>
    </div>
  );
}
