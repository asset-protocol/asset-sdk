import { useRef } from "react";
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
  return (
    <div className="border-[1px] border-solid border-gray-300">
      <AssetEditorHeader descriptonPlaceholder="Input Summary" />
      <div className="px-4">
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
                  selectFile("image/*").then((file) => {
                    if (file) {
                      const blobURL = URL.createObjectURL(file);
                      editor.current?.format(
                        "image",
                        blobURL,
                        Quill.sources.USER
                      );
                    }
                  });
                },
                video: () => {
                  selectFile("video/*,.mov,.mkv").then((file) => {
                    if (file) {
                      const blobURL = URL.createObjectURL(file);
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
            setContent(v);
          }}
          className="min-h-[600px]"
        ></QuillEditor>
      </div>
    </div>
  );
};

export default AssetRichTextEditor;
