import { useAssetHub } from '../context/provider';
import { UploadRequestOption } from 'rc-upload/lib/interface'

export function useStorageRequest() {
  const { storage } = useAssetHub();

  const uploadRequest = (options: UploadRequestOption, data: string | Blob) => {
    storage.upload({
      data: data,
      onProgress: (percent) => {
        options.onProgress?.({ percent: percent });
      }
    }).then(res => {
      options.onSuccess?.(res)
    }).catch(err => {
      options.onError?.(err)
      throw err
    })
  }

  const cr = (options: UploadRequestOption) => {
    uploadRequest(options, options.file);
  }
  return cr
}