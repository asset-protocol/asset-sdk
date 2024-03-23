import { AbiCoder, BytesLike } from "ethers";

export type FeeConfig = {
  currency: string;
  recipient: string;
  amount: number;
};

export function parseFeeCollectModuleInitData(data?: BytesLike): FeeConfig | undefined {
  if (!data || data == "0x") {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let res: any = []
  try {
    res = AbiCoder.defaultAbiCoder().decode(
      ["address", "address", "uint256"],
      data
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.warn("decode data error: ", e.message, data);
  }
  if (res?.length !== 3) {
    return;
  }
  return {
    currency: res[0],
    recipient: res[1],
    amount: res[2],
  };
}

export function encodeFeeCollectModuleInitData(config?: FeeConfig) {
  if (!config) {
    return;
  }
  return AbiCoder.defaultAbiCoder().encode(
    ["address", "address", "uint256"],
    [config.currency, config.recipient, config.amount]
  );
}