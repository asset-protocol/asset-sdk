import { ReactNode, useMemo } from "react";

export type AssetDescriptionProps = {
  text?: string;
  linkSelector?: (tag: string) => string;
}
export function AssetDescription({ text, linkSelector }: AssetDescriptionProps) {
  const parts = useMemo(() => {
    if (!text) return ""
    // 将文本分割成数组，其中包括普通文本和#开头的单词
    return text.split(/(\s+)/).reduce((acc: ReactNode[], part) => {
      // 检查部分是否为#开头的单词
      if (part.startsWith('#') && part.length > 1) {
        // 将#单词转换为超链接对象
        acc.push(
          <a href={linkSelector?.(part.substring(1))} key={part}>
            {part}
          </a>
        );
      } else {
        // 直接添加普通文本
        acc.push(part);
      }
      return acc;
    }, []);
  }, [text])
  return <span>{parts}</span>
}