import { useEffect, useRef } from "react";
import QuillEditor from "./QuillEditor";
import { selectFile } from "../utils/file";
import Quill from "quill";
import { AssetEditorHeader, useAssetEditor } from "../../../components";
export type RichTextEditorProps = {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const AssetRichTextEditor = (props: RichTextEditorProps) => {
  const { content, setContent } = useAssetEditor();
  const editor = useRef<Quill>(null);
  useEffect(() => {
    console.log("eitor rerender");
  }, []);
  return (
    <div className="border-[1px] border-solid border-gray-300">
      <AssetEditorHeader descriptonPlaceholder="Input Summary" />
      {/* <div id="toolbar-toolbar" className="toolbar">
        <span className="ql-formats">
          <select className="ql-font" defaultValue="">
            <option value=""></option>
            <option value="serif"></option>
            <option value="monospace"></option>
          </select>
          <select className="ql-size" defaultValue="">
            <option value="small"></option>
            <option value=""></option>
            <option value="large"></option>
            <option value="huge"></option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
        </span>
        <span className="ql-formats">
          <select className="ql-color"></select>
          <select className="ql-background"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
          <select className="ql-align" defaultValue="">
            <option value=""></option>
            <option value="center"></option>
            <option value="right"></option>
            <option value="justify"></option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-link"></button>
          <button className="ql-image"></button>
          <button className="ql-video"></button>
        </span>
      </div> */}
      <QuillEditor
        {...props}
        ref={editor}
        modules={{
          toolbar: {
            container: [
              [{ font: [] }, { size: [] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ script: "super" }, { script: "sub" }],
              [{ header: "1" }, { header: "2" }, "blockquote", "code-block"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              [{ direction: "rtl" }, { align: [] }],
              ["link", "image", "video", "formula"],
              ["clean"],
            ],
            handlers: {
              image: () => {
                console.log("handle image");
                selectFile("image/*").then((file) => {
                  if (file) {
                    const blobURL = URL.createObjectURL(file);
                    console.log(blobURL);
                    editor.current?.format(
                      "image",
                      blobURL,
                      Quill.sources.USER
                    );
                  }
                });
              },
              video: () => {
                console.log("handle video");
                selectFile("video/*,.mov,.mkv").then((file) => {
                  if (file) {
                    const blobURL = URL.createObjectURL(file);
                    console.log(blobURL);
                    editor.current?.format(
                      "video",
                      blobURL,
                      Quill.sources.USER
                    );
                  }
                });
              },
            },
          },
        }}
        theme="snow"
        value={content}
        onChange={(v) => {
          console.log(v);
          setContent(v);
        }}
        className="min-h-[600px]"
      ></QuillEditor>
    </div>
  );
};

export default AssetRichTextEditor;
