import { AbiCoder, BytesLike } from "ethers";

type FeeConfig = {
  recipient: string;
  amount: bigint;
};

export function parseFeeInitData(data?: BytesLike): FeeConfig | undefined {
  if (!data || data == "0x") {
    return;
  }
  try {
    const res = AbiCoder.defaultAbiCoder().decode(["address", "uint256"], data);
    console.log("decode amount", res.amount)
    return {
      recipient: res[0],
      amount: res[1],
    };
  } catch (e) {
    console.warn("Failed to parse fee init data", e)
    return undefined;
  }
}

export function encodeFeeInitData(config?: FeeConfig) {
  if (!config) {
    return;
  }
  console.log("encode amount", config.amount)
  const res = AbiCoder.defaultAbiCoder().encode(
    ["address", "uint256"],
    [config.recipient, config.amount]
  );
  return res;
}