import { SerializedLexicalNode } from "lexical";

export function findTypedChildrenNode<
  T extends SerializedLexicalNode = SerializedLexicalNode
>(node: SerializedLexicalNode, types: string[]): T[] {
  const res: T[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyNode = node as any;
  if (anyNode.children) {
    for (const c of anyNode.children) {
      if (types.includes(c.type)) {
        res.push(c as T);
      }
      res.push(...findTypedChildrenNode<T>(c, types));
    }
  }
  return res;
}