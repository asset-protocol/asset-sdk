import { UploadRequestOption } from "rc-upload/lib/interface";

export function useBlobRequest() {
  const cr = (options: UploadRequestOption) => {
    const url = URL.createObjectURL(options.file as Blob);
    options.onSuccess?.(url)
  }
  return cr
}