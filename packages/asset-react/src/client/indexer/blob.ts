import { gql, useApolloClient } from "@apollo/client";

const FETCH_BLOB = gql`
  query FetchBlob($url: String!) {
  fetchBlob(url: $url)
}
`

export function useFetchBlob() {
  const client = useApolloClient();
  return async (url: string) => {
    const res = await client.query<{ fetchBlob: string }>({
      query: FETCH_BLOB,
      variables: {
        url
      }
    })
    if (res.data.fetchBlob) {
      // 将二进制字符串转换为字符码数组
      const charCodeArray = new Uint8Array(res.data.fetchBlob.length);
      for (let i = 0; i < res.data.fetchBlob.length; i++) {
        charCodeArray[i] = res.data.fetchBlob.charCodeAt(i);
      }
      // 使用字符码数组创建 Blob 对象
      const blob = new Blob([charCodeArray], { type: 'application/octet-stream' });
      return blob;
    }
  }
}