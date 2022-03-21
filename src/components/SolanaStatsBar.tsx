/* eslint-disable jsx-a11y/alt-text */
import { FC } from 'react'
import { useQuery } from 'react-query'
import { SolscanMarket } from '../global'
import Image from 'next/image'
import fetchSolStats from '../services/fetchSolStats'
import DarkModeSwitcher from './DarkModeSwitcher'

export const SolanaStatsBar: FC = () => {
  const { isLoading, isError, data } = useQuery<SolscanMarket>(
    'SolscanStats',
    fetchSolStats,
    {
      refetchInterval: 3000,
    }
  )
  return (
    <div className='flex flex-row flex-wrap justify-between items-center p-2 text-white bg-slate-900'>
      <div className='flex flex-row items-center'>
        <Image src='/img/solana.svg' width='16' height='16' alt='Solana' />
        <div className='ml-2'>
        {isLoading ? (
          <Image src='/img/loading.webp' width='20' height='20' alt='loading' />
        ) : isError ? (
          ''
        ) : (
          'SOL Price $' + data?.priceUsdt + ', VOL ' + data?.volumeUsdt
        )}
        </div>
      </div>
      <DarkModeSwitcher />
    </div>
  )
}
