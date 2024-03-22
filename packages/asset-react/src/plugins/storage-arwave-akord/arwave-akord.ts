// import { Auth, Akord } from "@akord/akord-js";
// import { IStorage, UploadObject } from "./storage";
// export class ArAkordStorage implements IStorage {
//   private akord?: Akord;
//   constructor() {

//   }

//   async upload(args: UploadObject): Promise<string> {
//     await this.init();
//     const res = await this.akord!.stack.create("OtOWwAd0wkoqjUQx-OqKy1LA5zPFzCicuQFbI27yxYw", args.data, {
//       progressHook: (pp) => {
//         args.onProgress?.(pp);
//       }
//     });
//     return res.uri;
//   }
//   async getUrl(uri: string): Promise<string> {
//     return Promise.resolve(uri);
//   }

//   async init() {
//     if (this.akord) return;
//     Auth.configure({ apiKey: "crRolq-t2aFBH6S3S8v-6Cdxn7FXrzp4l36qePT5tEY" })
//     const { wallet, jwt } = await Auth.authenticate();
//     console.log("akord:", wallet, jwt);
//     this.akord = await Akord.init(wallet, { authToken: jwt });
//   }
// }