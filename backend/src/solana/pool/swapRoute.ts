import BN from 'bn.js';

import {
  ApiClmmPoolsItem,
  ApiPoolInfo,
  Clmm,
  Currency,
  CurrencyAmount,
  fetchMultipleMintInfos,
  Percent,
  Token,
  TokenAmount,
  TradeV2
} from '@raydium-io/raydium-sdk';
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import {
  Keypair,
  PublicKey,
  PublicKeyInitData,
} from '@solana/web3.js';


import { formatAmmKeysToApi } from './formatAmmKeys';
import { buildAndSendTx, getWalletTokenAccount } from './util';
import { connection } from '../cnn';

import { formatClmmKeys } from './formatClmmKeys';
import { makeTxVersion, PROGRAMIDS } from '../../config';


type WalletTokenAccounts = Awaited<ReturnType<typeof getWalletTokenAccount>>
type TestTxInputInfo = {
  inputToken: Token | Currency
  outputToken: Token | Currency
  inputTokenAmount: TokenAmount | CurrencyAmount
  slippage: Percent
  walletTokenAccounts: WalletTokenAccounts
  wallet: Keypair

  feeConfig?: {
    feeBps: BN,
    feeAccount: PublicKey
  }
}

export async function routeSwap(input: TestTxInputInfo, wallet: Keypair) {
  // -------- pre-action: fetch Clmm pools info and ammV2 pools info --------
  const clmmPools: ApiClmmPoolsItem[] = await formatClmmKeys(PROGRAMIDS.CLMM.toString())
  const clmmList = Object.values(
    await Clmm.fetchMultiplePoolInfos({ connection, poolKeys: clmmPools, chainTime: new Date().getTime() / 1000 })
  ).map((i) => i.state)

  const sPool: ApiPoolInfo = await formatAmmKeysToApi(PROGRAMIDS.AmmV4.toString(), true) 

  // -------- step 1: get all route --------
  const getRoute = TradeV2.getAllRoute({
    inputMint: input.inputToken instanceof Token ? input.inputToken.mint : PublicKey.default,
    outputMint: input.outputToken instanceof Token ? input.outputToken.mint : PublicKey.default,
    apiPoolList: sPool,
    clmmList,
  })

  // -------- step 2: fetch tick array and pool info --------
  const [tickCache, poolInfosCache] = await Promise.all([
    await Clmm.fetchMultiplePoolTickArrays({ connection, poolKeys: getRoute.needTickArray, batchRequest: true }),
    await TradeV2.fetchMultipleInfo({ connection, pools: getRoute.needSimulate, batchRequest: true }),
  ])

  // -------- step 3: calculation result of all route --------
  const [routeInfo] = TradeV2.getAllRouteComputeAmountOut({
    directPath: getRoute.directPath,
    routePathDict: getRoute.routePathDict,
    simulateCache: poolInfosCache,
    tickCache,
    inputTokenAmount: input.inputTokenAmount,
    outputToken: input.outputToken,
    slippage: input.slippage,
    chainTime: new Date().getTime() / 1000, // this chain time

    feeConfig: input.feeConfig,

    mintInfos: await fetchMultipleMintInfos({connection, mints: [
      ...clmmPools.map(i => [{mint: i.mintA, program: i.mintProgramIdA}, {mint: i.mintB, program: i.mintProgramIdB}]).flat().filter((i: { program: string; }) => i.program === TOKEN_2022_PROGRAM_ID.toString()).map((i: { mint: PublicKeyInitData; }) => new PublicKey(i.mint)),
    ]}),

    epochInfo: await connection.getEpochInfo(),
  })

  // -------- step 4: create instructions by SDK function --------
  const { innerTransactions } = await TradeV2.makeSwapInstructionSimple({
    routeProgram: PROGRAMIDS.Router,
    connection,
    swapInfo: routeInfo,
    ownerInfo: {
      wallet: input.wallet.publicKey,
      tokenAccounts: input.walletTokenAccounts,
      associatedOnly: true,
      checkCreateATAOwner: true,
    },
    
    computeBudgetConfig: { // if you want add compute instruction
      units: 400000, // compute instruction
      microLamports: 1, // fee add 1 * 400000 / 10 ** 9 SOL
    },
    makeTxVersion,
  })

  return { txids: await buildAndSendTx(innerTransactions, wallet) }
}