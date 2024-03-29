import { AbiCoder, BytesLike } from "ethers";
export type TokenCollectConfig = {
  currency: string;
  recipient: string;
  amount: bigint;
};

export function parseTokenCollectInitData(
  data?: BytesLike
): TokenCollectConfig | undefined {
  if (!data || data == "0x") {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let res: any = [];
  try {
    res = AbiCoder.defaultAbiCoder().decode(
      ["address", "address", "uint256"],
      data
    );
  } catch {
    return undefined;
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

export function encodeTokenCollectInitData(config?: TokenCollectConfig) {
  if (!config) {
    return;
  }
  return AbiCoder.defaultAbiCoder().encode(
    ["address", "address", "uint256"],
    [config.currency, config.recipient, config.amount]
  );
}