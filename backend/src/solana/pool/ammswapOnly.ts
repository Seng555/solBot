import assert from 'assert';

import {
    Liquidity,
    LiquidityPoolKeys,
    Percent,
    Token,
    TokenAmount,
} from '@raydium-io/raydium-sdk';
import { Keypair } from '@solana/web3.js';


import { formatAmmKeysById } from './formatAmmKeysById';
import { buildAndSendTx, getWalletTokenAccount } from './util';
import { connection } from '../cnn';
import { sendBack } from '../../socket/socket';
import { makeTxVersion } from '../../config';

type WalletTokenAccounts = Awaited<ReturnType<typeof getWalletTokenAccount>>
type TestTxInputInfo = {
    outputToken: Token
    targetPool: string
    inputTokenAmount: TokenAmount
    slippage: Percent
    walletTokenAccounts: WalletTokenAccounts
    wallet: Keypair
}

export async function swapOnlyAmm(input: TestTxInputInfo, poolKey: LiquidityPoolKeys) {
    // -------- pre-action: get pool info --------
    const targetPoolInfo = await formatAmmKeysById(input.targetPool, connection)
    assert(targetPoolInfo, 'cannot find the target pool')
    const poolKeys = poolKey //jsonInfo2PoolKeys(targetPoolInfo) as LiquidityPoolKeys

    //console.log(poolKeys);

    // -------- step 1: coumpute amount out --------
    const { amountOut, minAmountOut, priceImpact } = Liquidity.computeAmountOut({
        poolKeys: poolKeys,
        poolInfo: await Liquidity.fetchInfo({ connection, poolKeys }),
        amountIn: input.inputTokenAmount,
        currencyOut: input.outputToken,
        slippage: input.slippage,
    })
    //return { txids:"kdfgjidfhngjkn" }
    // -------- step 2: create instructions by SDK function --------
    const { innerTransactions } = await Liquidity.makeSwapInstructionSimple({
        connection,
        poolKeys,
        userKeys: {
            tokenAccounts: input.walletTokenAccounts,
            owner: input.wallet.publicKey,
        },
        amountIn: input.inputTokenAmount,
        amountOut: minAmountOut,
        fixedSide: 'in',
        makeTxVersion,
    })

    //console.log(priceImpact.toFixed())
    const priceCal = {
        'amountOut': amountOut.toFixed(),
        'minAmountOut': minAmountOut.toFixed(),
        "priceImpact": priceImpact.toFixed()+"%"
    }

    sendBack({ type: 0, msg: priceCal });

    return { txids: await buildAndSendTx(innerTransactions, input.wallet) }
}