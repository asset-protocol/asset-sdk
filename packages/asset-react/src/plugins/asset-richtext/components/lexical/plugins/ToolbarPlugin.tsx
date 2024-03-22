/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";

import Icon from "@ant-design/icons";
import { Button, ButtonProps } from "antd";
import alignJustify from "@material-design-icons/svg/outlined/format_align_justify.svg?raw";
import alignCenter from "@material-design-icons/svg/outlined/format_align_center.svg?raw";
import format_align_right from "@material-design-icons/svg/outlined/format_align_right.svg?raw";
import format_align_left from "@material-design-icons/svg/outlined/format_align_left.svg?raw";
import strikethrough_s from "@material-design-icons/svg/outlined/strikethrough_s.svg?raw";
import underline from "@material-design-icons/svg/outlined/format_underlined.svg?raw";
import format_italic from "@material-design-icons/svg/outlined/format_italic.svg?raw";
import format_bold from "@material-design-icons/svg/outlined/format_bold.svg?raw";
import redo from "@material-design-icons/svg/outlined/redo.svg?raw";
import undo from "@material-design-icons/svg/outlined/undo.svg?raw";
import clsx from "clsx";
const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

function SvgIcon(props: { svg: string }) {
  return (
    <Icon
      className="scale-75"
      component={() => (
        <span dangerouslySetInnerHTML={{ __html: props.svg }}></span>
      )}
    />
  );
}

function ToolButton(props: ButtonProps) {
  const { className, ...resProps } = props;
  return <Button className={clsx(className)} {...resProps}></Button>;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  return (
    <div className="flex gap-1" ref={toolbarRef}>
      <ToolButton
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
        icon={<SvgIcon svg={undo} />}
      ></ToolButton>
      <ToolButton
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
        icon={<SvgIcon svg={redo} />}
      />
      <Divider />
      <ToolButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        type={isBold ? "primary" : undefined}
        aria-label="Format Bold"
        icon={<SvgIcon svg={format_bold} />}
      ></ToolButton>
      <ToolButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        type={isItalic ? "primary" : undefined}
        aria-label="Format Italics"
        icon={<SvgIcon svg={format_italic} />}
      ></ToolButton>
      <ToolButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        type={isUnderline ? "primary" : undefined}
        aria-label="Format Underline"
        icon={<SvgIcon svg={underline} />}
      ></ToolButton>
      <ToolButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        type={isStrikethrough ? "primary" : undefined}
        aria-label="Format Strikethrough"
        icon={<SvgIcon svg={strikethrough_s} />}
      ></ToolButton>
      <Divider />
      <ToolButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="toolbar-item spaced"
        aria-label="Left Align"
        icon={<SvgIcon svg={format_align_left} />}
      ></ToolButton>
      <ToolButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="toolbar-item spaced"
        aria-label="Center Align"
        icon={<SvgIcon svg={alignCenter} />}
      ></ToolButton>
      <ToolButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="toolbar-item spaced"
        aria-label="Right Align"
        icon={<SvgIcon svg={format_align_right} />}
      ></ToolButton>
      <ToolButton
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="toolbar-item"
        aria-label="Justify Align"
        icon={<SvgIcon svg={alignJustify} />}
      ></ToolButton>
    </div>
  );
}
