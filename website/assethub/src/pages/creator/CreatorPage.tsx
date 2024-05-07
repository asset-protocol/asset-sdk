import { useAccount } from "wagmi";
import { CurationApprove } from "../curation/CurationApprove";

export function CreatorPage() {
  const account = useAccount();
  return (
    <div className="max-w-screen-lg mx-auto">
      {account.address && <CurationApprove account={account.address} />}
    </div>
  );
}
