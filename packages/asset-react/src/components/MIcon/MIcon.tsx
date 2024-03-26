import { MaterialSymbol } from "material-symbols";

export function OutlineIcon({ icon }: { icon: MaterialSymbol }) {
  return <span className="material-symbols-outlined">{icon}</span>;
}
