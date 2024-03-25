import { LexicalEditor } from "lexical";
import { SvgIcon, ToolButton } from "./ToolButton";

import imageIcon from "@material-design-icons/svg/outlined/image.svg?raw";
import { InsertImageDialog } from "../ImagesPlugin";
import { useState } from "react";

export function InsertImageToolButton({ editor }: { editor: LexicalEditor }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ToolButton
        title="Insert image"
        onClick={() => setOpen(true)}
        icon={<SvgIcon svg={imageIcon} />}
      ></ToolButton>
      <InsertImageDialog
        editor={editor}
        onClose={() => setOpen(false)}
        open={open}
      />
    </>
  );
}
