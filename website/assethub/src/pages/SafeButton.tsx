import { useAssetHub } from '@asset-protocol/react'
import SafeApiKit from '@safe-global/api-kit'
import { Select } from 'antd'
import { baseSepolia } from 'wagmi/chains'
import Safe from '@safe-global/protocol-kit'
import { useEffect, useState } from 'react';
import { DefaultOptionType } from 'antd/es/select';
import { ContractRunner, Signer, ethers } from 'ethers';
import { Config, useConnectorClient } from 'wagmi'

export class SafeSigner implements Required<ContractRunner> {
  isMulti: boolean = true;

  constructor(private safe: Safe, private signer: Signer) {
  }

  get provider() {
    return this.signer.provider;
  }

  getAddress(): Promise<string> {
    return this.safe.getAddress();
  }

  estimateGas(tx: ethers.TransactionRequest): Promise<bigint> {
    return this.signer.estimateGas(tx);
  }

  call(tx: ethers.TransactionRequest): Promise<string> {
    return this.signer.call(tx);
  }

  resolveName(name: string): Promise<string | null> {
    return this.signer.resolveName(name);
  }

  async sendTransaction(tx: ethers.TransactionRequest): Promise<ethers.TransactionResponse> {
    const safeTx = await this.safe.createTransaction({
      transactions: [{
        to: tx.to!.toString(),
        value: tx.value?.toString() ?? "0",
        data: tx.data ?? "0x"
      }],
    })
    const safeTxhash = await this.safe.getTransactionHash(safeTx);
    const txSign = await this.safe.signHash(safeTxhash);
    const apiKit = new SafeApiKit({
      chainId: BigInt(baseSepolia.id), // set the correct chainId
    })
    await apiKit.proposeTransaction({
      safeAddress: await this.safe.getAddress(),
      safeTransactionData: safeTx.data,
      safeTxHash: safeTxhash,
      senderAddress: await this.signer.getAddress(),
      senderSignature: txSign.data
    })
    const res = await apiKit.getTransaction(safeTxhash);
    return new ethers.TransactionResponse({ ...res, hash: safeTxhash } as any, this.provider!);
  }
}

export function SafeButton() {
  const { signer, setContractRunner, account } = useAssetHub();
  const [safes, setSafes] = useState<DefaultOptionType[]>();
  const { data: client } = useConnectorClient<Config>()

  const handleChange = async (v: string) => {
    if (v == "" || !client || !signer.provider) {
      setContractRunner(undefined);
      return;
    }
    // Create Safe instance
    const protocolKit = await Safe.init({
      provider: client?.transport,
      safeAddress: v
    })
    const rn = new SafeSigner(protocolKit, signer)
    setContractRunner(rn);
  }

  useEffect(() => {
    if (account) {
      const apiKit = new SafeApiKit({
        chainId: BigInt(baseSepolia.id), // set the correct chainId
      })
      apiKit.getSafesByOwner(account.address).then(res => {
        const data = res.safes.map(s => ({
          key: s,
          value: s,
          label: s
        }))
        setSafes([{
          key: "",
          value: "",
          label: "Unset"
        }, ...data])
      })
    }

  }, [account])

  return <Select options={safes} className='w-[200px]' onChange={handleChange}></Select>
}
