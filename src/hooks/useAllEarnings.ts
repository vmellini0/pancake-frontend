import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getMasterChefContract, getFarms } from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'
import useEarnings from './useEarnings';

const useAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const sushi = useSushi()
  const farms = getFarms(sushi)
  const masterChefContract = getMasterChefContract(sushi)
  const block = useBlock()

  const fetchAllBalances = useCallback(async () => {
    const balances: Array<BigNumber> = await Promise.all(
      farms.map(({ pid }: { pid: number }) =>{
        console.log(getEarned(masterChefContract, pid, account))
        return getEarned(masterChefContract, pid, account)
      }
      ),
    )
    console.log(balances)
    setBalance(balances)
  }, [account, masterChefContract, sushi])

  useEffect(() => {
    if (account && masterChefContract && sushi) {
      fetchAllBalances()
    }
  }, [account, block, masterChefContract, setBalance, sushi])

  console.log(farms, balances)

  return balances
}

export default useAllEarnings
