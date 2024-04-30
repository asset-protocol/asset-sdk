

export function selectFile(accept?: string): Promise<File | undefined> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    if (accept) {
      input.accept = accept;
    }
    input.onchange = () => {
      const file = input.files?.[0];
      resolve(file);
    };
    input.click();
  });
}