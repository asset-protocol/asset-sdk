import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $createCodeNode } from "@lexical/code";
import { Button, Dropdown, MenuProps } from "antd";
import { blockTypeToBlockName, rootTypeToRootName } from "./consts";
import { OutlineIcon } from "../../../../../../components/MIcon/MIcon";
import { ReactNode } from "react";

function MenuItem({ children }: { children: ReactNode }) {
  return <div className="flex items-center">{children}</div>;
}

const formatLabels = {
  [blockTypeToBlockName.paragraph]: (
    <MenuItem>
      <OutlineIcon icon="format_paragraph" />
      <span>Normal</span>
    </MenuItem>
  ),
  [blockTypeToBlockName.h1]: (
    <MenuItem>
      <OutlineIcon icon="format_h1" />
      <span>Heading 1</span>
    </MenuItem>
  ),
  [blockTypeToBlockName.h2]: (
    <MenuItem>
      <OutlineIcon icon="format_h2" />
      <span>Heading 2</span>
    </MenuItem>
  ),
  [blockTypeToBlockName.h3]: (
    <MenuItem>
      <OutlineIcon icon="format_h3" />
      <span>Heading 3</span>
    </MenuItem>
  ),
  [blockTypeToBlockName.bullet]: (
    <MenuItem>
      <OutlineIcon icon="format_list_bulleted" />
      <span>Bullet List</span>
    </MenuItem>
  ),
  [blockTypeToBlockName.number]: (
    <MenuItem>
      <OutlineIcon icon="format_list_numbered" />
      <span>Numbered List</span>
    </MenuItem>
  ),
  [blockTypeToBlockName.check]: (
    <MenuItem>
      <OutlineIcon icon="checklist" />
      <span>Check List</span>
    </MenuItem>
  ),
  [blockTypeToBlockName.quote]: (
    <MenuItem>
      <OutlineIcon icon="format_quote" />
      <span>Quote</span>
    </MenuItem>
  ),
  [blockTypeToBlockName.code]: (
    <MenuItem>
      <OutlineIcon icon="code_blocks" />
      <span>Code Block</span>
    </MenuItem>
  ),
};

export function BlockFormatDropDown({
  editor,
  blockType,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
}) {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatCheckList = () => {
    if (blockType !== "check") {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        let selection = $getSelection();

        if (selection !== null) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertRawText(textContent);
            }
          }
        }
      });
    }
  };

  const items: MenuProps["items"] = [
    {
      key: blockTypeToBlockName.paragraph,
      label: formatLabels[blockTypeToBlockName.paragraph],
      onClick: formatParagraph,
    },
    {
      key: blockTypeToBlockName.h1,
      label: formatLabels[blockTypeToBlockName.h1],
      onClick: () => formatHeading("h1"),
    },
    {
      key: blockTypeToBlockName.h2,
      label: formatLabels[blockTypeToBlockName.h2],
      onClick: () => formatHeading("h2"),
    },
    {
      key: blockTypeToBlockName.h3,
      label: formatLabels[blockTypeToBlockName.h3],
      onClick: () => formatHeading("h3"),
    },
    {
      key: blockTypeToBlockName.bullet,
      label: formatLabels[blockTypeToBlockName.bullet],
      onClick: formatBulletList,
    },
    {
      key: blockTypeToBlockName.number,
      label: formatLabels[blockTypeToBlockName.number],
      onClick: formatNumberedList,
    },
    {
      key: blockTypeToBlockName.check,
      label: formatLabels[blockTypeToBlockName.check],
      onClick: formatCheckList,
    },
    {
      key: blockTypeToBlockName.quote,
      label: formatLabels[blockTypeToBlockName.quote],
      onClick: formatQuote,
    },
    {
      key: blockTypeToBlockName.code,
      label: formatLabels[blockTypeToBlockName.code],
      onClick: formatCode,
    },
  ];
  console.log("blocktype", blockType);
  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Button className="px-1">
        <div className="flex items-center">
          {formatLabels[blockTypeToBlockName[blockType]]}
          <OutlineIcon icon="arrow_drop_down" />
        </div>
      </Button>
    </Dropdown>
  );
}
