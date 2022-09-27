import { useMemo } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import { Web3Provider, JsonRpcSigner } from '@ethersproject/providers'

import kingOfFoolABI from '../config/KingOfFool.json'

const getSigner = (library: Web3Provider, account: string): JsonRpcSigner => {
  return library.getSigner(account).connectUnchecked()
}

const getProviderOrSigner = (library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner => {
  return account ? getSigner(library, account) : library
}

const getContract = (address: string, library: Web3Provider, account?: string): Contract => {
  return new Contract(address, kingOfFoolABI, getProviderOrSigner(library, account) as any)
}

const userKingOfFool = (address: string, withSigner = true) => {
  const { library, account } = useWeb3React()

  return useMemo(() => {
    if (!library) return null

    try {
      return getContract(address, library, withSigner && account ? account : undefined)
    } catch {
      return null
    }
  }, [address, library, withSigner, account])
}

export default userKingOfFool
