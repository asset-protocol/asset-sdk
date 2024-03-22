function blobToBase64(blob: Blob, callback: (base64: string | null) => void) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const base64 = event.target?.result as string | null;
    callback(base64);
  };
  reader.onerror = function (event) {
    console.error("FileReader error:", event.target?.error);
    callback(null);
  };
  reader.readAsDataURL(blob);
}
// 使用Lorem Picsum API生成随机图片URL
export function generateRandomCover(width: number, height: number) {
  return new Promise<string>((resolve, reject) => {
    const randomImageId = Math.floor(Math.random() * 1000); // 随机图片ID
    const imageUrl = `https://picsum.photos/id/${randomImageId}/${width}/${height}`;

    fetch(imageUrl).then(res => res.blob())
      .then(blob => {
        blobToBase64(blob, function (base64) {
          if (base64) {
            resolve(base64)
          } else {
            reject("Failed to convert blob to base64.")
          }
        });
      })
  })
}