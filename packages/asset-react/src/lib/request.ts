import { UploadRequestOption } from "rc-upload/lib/interface";

export function useBlobRequest() {
  const cr = (options: UploadRequestOption) => {
    options.onSuccess?.(options.file as Blob)
  }
  return cr
}