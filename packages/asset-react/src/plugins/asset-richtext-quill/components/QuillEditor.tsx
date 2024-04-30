import "quill/dist/quill.snow.css";
import "../styles/snow.css";
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import Image from "../formats/image";
import Quill, { QuillOptions } from "quill";
import { Delta } from "quill/core";
import Video from "../formats/video";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.min.css";

Quill.register("formats/image", Image, true);
Quill.register("formats/video", Video, true);

export type QuillEditorProps = QuillOptions & {
  value?: string | Delta;
  onChange?: (text: string) => void;
  className?: string;
};

const preModules = {
  syntax: { hljs },
};

// Editor is an uncontrolled React component
const QuillEditor = forwardRef<Quill | null, QuillEditorProps>((props, ref) => {
  const { readOnly, value, onChange, ...quillOptions } = props;
  quillOptions.modules = { ...preModules, ...quillOptions.modules };
  const containerRef = useRef<HTMLDivElement>(null);
  const quill = useRef<Quill | null>(null);

  useImperativeHandle<Quill | null, Quill | null>(
    ref,
    () => {
      return quill.current;
    },
    [quill]
  );

  useLayoutEffect(() => {
    quill.current?.enable(!readOnly);
  }, [quill, readOnly]);

  useLayoutEffect(() => {
    if (!quill.current) return;
    console.log("quill value changed");
    if (typeof value === "string") {
      if (value !== JSON.stringify(quill.current.getContents())) {
        quill.current.setContents(new Delta(JSON.parse(value ? value : "[]")));
      }
    } else if (
      value instanceof Delta &&
      JSON.stringify(quill.current.getContents()) !== JSON.stringify(value)
    ) {
      quill.current.setContents(value);
    }
  }, [quill, value]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!quill.current) {
      const _quill = new Quill(container, quillOptions);
      console.log("new quill instance");
      _quill.on(Quill.events.TEXT_CHANGE, () => {
        if (onChange) {
          onChange(JSON.stringify(_quill.getContents()));
        }
      });
      quill.current = _quill;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} id="test"></div>;
});
QuillEditor.displayName = "QuillEditor";
export default QuillEditor;
