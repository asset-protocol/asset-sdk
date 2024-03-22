import Arweave from 'arweave';
import { IStorage, UploadObject } from '../../core/storage';


export class ArwaveStorage implements IStorage {
  private ar: Arweave
  constructor() {
    // Since v1.5.1 you're now able to call the init function for the web version without options. The current URL path will be used by default. This is recommended when running from a gateway.
    this.ar = Arweave.init({});
  }

  public readonly scheme = {
    name: 'ar',
    label: 'Arweave'
  }

  async upload(args: UploadObject): Promise<string> {
    let data: string | ArrayBuffer;
    if (args.data instanceof Blob) {
      data = await new Response(args.data).arrayBuffer();
    } else {
      data = args.data;
    }

    // connect to the extension
    await window.arweaveWallet.connect(["SIGN_TRANSACTION"]);

    const tx = await this.ar.createTransaction({ data });
    await this.ar.transactions.sign(tx);
    const uploader = await this.ar.transactions.getUploader(tx);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
      if (args.onProgress) {
        args.onProgress(uploader.uploadedChunks / uploader.totalChunks * 100);
      }
    }
    return `ar://${tx.id}`;
  }

  getUrl(uri: string): string {
    const id = uri.replace('ar://', '');
    return `https://arweave.net/${id}`;
  }
}

