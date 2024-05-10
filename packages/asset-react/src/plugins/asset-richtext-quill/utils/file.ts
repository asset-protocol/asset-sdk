

export function selectFile(accept?: string): Promise<File | undefined> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    console.log("selectFile")
    if (accept) {
      input.accept = accept;
    }
    input.onchange = () => {
      const file = input.files?.[0];
      console.log("file selected", input.files)
      resolve(file);
    };
    input.click();
  });
}