import "quill/dist/quill.snow.css";
import "../styles/snow.css";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import Image from "../formats/image";
import Quill, { QuillOptions } from "quill";
import { Delta, EmitterSource } from "quill/core";
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

export type QuillEdtorInstance = {
  format(name: string, value: unknown, source?: EmitterSource): unknown;
};

// Editor is an uncontrolled React component
const QuillEditor = forwardRef<QuillEdtorInstance, QuillEditorProps>(
  (props, ref) => {
    const { readOnly, value, onChange, ...quillOptions } = props;
    quillOptions.modules = { ...preModules, ...quillOptions.modules };
    const containerRef = useRef<HTMLDivElement>(null);
    const quill = useRef<Quill | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        format: (...args) => quill.current?.format(...args),
      }),
      [quill]
    );

    useEffect(() => {
      quill.current?.enable(!readOnly);
    }, [quill, readOnly]);

    useLayoutEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      if (!quill.current) {
        const _quill = new Quill(container, quillOptions);
        _quill.on(Quill.events.TEXT_CHANGE, () => {
          if (onChange) {
            onChange(JSON.stringify(_quill.getContents()));
          }
        });
        if (typeof value === "string") {
          _quill.setContents(new Delta(JSON.parse(value ? value : "[]")));
        }
        quill.current = _quill;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div ref={containerRef}></div>;
  }
);
QuillEditor.displayName = "QuillEditor";
export default QuillEditor;
