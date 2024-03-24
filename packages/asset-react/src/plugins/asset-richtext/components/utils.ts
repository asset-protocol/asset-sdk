import { SerializedLexicalNode } from "lexical";

export function findTypedChildrenNode<
  T extends SerializedLexicalNode = SerializedLexicalNode
>(node: SerializedLexicalNode, type: string): T[] {
  const res: T[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyNode = node as any;
  if (anyNode.children) {
    for (const c of anyNode.children) {
      if (c.type === type) {
        res.push(c as T);
      }
      res.push(...findTypedChildrenNode<T>(c, type));
    }
  }
  return res;
}