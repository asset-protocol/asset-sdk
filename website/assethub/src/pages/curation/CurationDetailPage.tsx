import { useParams } from "react-router-dom";
import { CurationDetail } from "./CurationDetail";
import { useGetCurationById } from "@asset-protocol/react";

export function CurationDetailPage() {
  const { curationId } = useParams();
  const { data, loading } = useGetCurationById(curationId ?? "");
  if (loading) return <div>Loading...</div>;
  return (
    data && (
      <div className="max-w-screen-lg mx-auto">
        <CurationDetail curation={data} />
      </div>
    )
  );
}
