import { useLayoutEffect, useRef } from "react";
import Quill, { QuillOptions } from "quill";

export type EditorProps = {
  children?: React.ReactNode;
  rootStyle?: React.CSSProperties;
  config: QuillOptions;
  onSelectionChange?: () => void;
  onLoad?: (quill: Quill) => void;
};

const Editor = ({
  children,
  rootStyle,
  config,
  onSelectionChange,
  onLoad,
  ...props
}: EditorProps) => {
  const ref = useRef(null);
  const rootStyleRef = useRef(rootStyle);
  const onSelectionChangeRef = useRef(onSelectionChange);
  const onLoadRef = useRef(onLoad);

  useLayoutEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  useLayoutEffect(() => {
    onLoadRef.current = onLoad;
  }, [onLoad]);

  const configRef = useRef(config);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const quill = new Quill(ref.current, configRef.current);
    if (rootStyleRef) {
      Object.assign(quill.root.style, rootStyleRef.current);
    }
    quill.on(Quill.events.SELECTION_CHANGE, () => {
      onSelectionChangeRef.current?.();
    });
    onLoadRef.current?.(quill);
  }, []);

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
};

export default Editor;
