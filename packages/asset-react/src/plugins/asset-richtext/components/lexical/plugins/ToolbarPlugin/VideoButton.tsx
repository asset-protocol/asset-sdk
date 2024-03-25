import { LexicalEditor } from "lexical";
import { VideoUploadButton } from "../VideoPlugin";
import { SvgIcon, ToolButton } from "./ToolButton";
import icon from "@material-design-icons/svg/outlined/video_file.svg?raw";

export function InsertVideoToolButton({ editor }: { editor: LexicalEditor }) {
  return (
    <VideoUploadButton editor={editor}>
      <ToolButton title="Insert video" icon={<SvgIcon svg={icon} />}></ToolButton>
    </VideoUploadButton>
  );
}
