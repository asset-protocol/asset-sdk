import Vditor from "vditor";
import "vditor/dist/index.css";
import React, { useState, useEffect } from "react";
import { useReplaceUri } from "../../../lib/utils";
export type MarkdownEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export default function MarkdownEditor(props: MarkdownEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [vd, setVd] = useState<Vditor>();
  const replaceUri = useReplaceUri();

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    const vditor = new Vditor(editorRef.current, {
      mode: "wysiwyg",
      after: () => {
        vditor.setValue(props.value ?? "");
        setVd(vditor);
      },
      input: (t) => props.onChange?.(t),
      cache: {
        id: "ah-md-editor-cache",
      },
      upload: {
        multiple: false,
        handler: async (files) => {
          const res: { uri: string; name: string; isError?: boolean }[] = [];
          for (let i = 0; i < files.length; i++) {
            const f = files[i];
            res[i] = {
              name: f.name,
              uri: "",
            };
            try {
              res[i].uri = URL.createObjectURL(f);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
              console.error(e);
              res[i].isError = true;
            }
          }
          return res.map((r) => r.uri).join("\n");
        },
      },
      image: {
        isPreview: true,
        preview: (e) => {
          console.log("iamge preview", e);
          const image = e.getElementsByTagName("img");
          for (let i = 0; i < image.length; i++) {
            image[i].src = replaceUri(image[i].src)!;
          }
          const audios = e.getElementsByTagName("audio");
          for (let i = 0; i < audios.length; i++) {
            audios[i].src = replaceUri(audios[i].src)!;
          }
          const videos = e.getElementsByTagName("video");
          for (let i = 0; i < videos.length; i++) {
            videos[i].src = replaceUri(videos[i].src)!;
          }
          const links = e.getElementsByTagName("a");
          for (let i = 0; i < links.length; i++) {
            links[i].href = replaceUri(links[i].href)!;
          }
        },
      },
      preview: {
        mode: "both",
        parse: (e) => {
          const image = e.getElementsByTagName("img");
          for (let i = 0; i < image.length; i++) {
            image[i].src = replaceUri(image[i].src)!;
          }
          const audios = e.getElementsByTagName("audio");
          for (let i = 0; i < audios.length; i++) {
            audios[i].src = replaceUri(audios[i].src)!;
          }
          const videos = e.getElementsByTagName("video");
          for (let i = 0; i < videos.length; i++) {
            videos[i].src = replaceUri(videos[i].src)!;
          }
          const links = e.getElementsByTagName("a");
          for (let i = 0; i < links.length; i++) {
            links[i].href = replaceUri(links[i].href)!;
          }
        },
      },
    });
    // Clear the effect
    return () => {
      vd?.destroy();
      setVd(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={editorRef} className={props.className}></div>;
}
