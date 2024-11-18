import { Connection, PublicKey, Transaction, VersionedTransaction, TransactionMessage } from '@solana/web3.js'
import {
  Liquidity,
  LiquidityPoolKeys,
  jsonInfo2PoolKeys,
  TokenAccount,
  Token,
  TokenAmount,
  TOKEN_PROGRAM_ID,
  Percent,
  SPL_ACCOUNT_LAYOUT,
  ApiPoolInfoV4,
  ReplaceType,
} from '@raydium-io/raydium-sdk'
import { Wallet } from '@coral-xyz/anchor'
import { formatAmmKeysById } from './pool/formatAmmKeysById'
import BN from 'bn.js'


/**
 * Class representing a Raydium Swap operation.
 */
class RaydiumSwap {
  //connection: Connection

  /**
   * Create a RaydiumSwap instance.
   * @param {string} RPC_URL - The RPC URL for connecting to the Solana blockchain.
   * @param {string} WALLET_PRIVATE_KEY - The private key of the wallet in base58 format.
   */
  constructor() {
    /*this.connection = new Connection(RPC_URL
      , { commitment: 'confirmed' })*/
   // this.wallet = new Wallet(Keypair.fromSecretKey(Uint8Array.from(bs58.decode(WALLET_PRIVATE_KEY))))
  }



    /**
   * Finds pool information for the given token pair.
   * @param {string} poolKey - Pool publickey.
   * @returns {ApiPoolInfoV4 | null} The liquidity pool keys if found, otherwise null.
   */
    async findPoolInfoForTokens(poolKey: string, connection: Connection):Promise<ReplaceType<ApiPoolInfoV4, string, PublicKey> | null> {
    const poolData = await formatAmmKeysById(poolKey, connection )
    if (!poolData) return null
    return jsonInfo2PoolKeys(poolData)
  }

    /**
   * Retrieves token accounts owned by the wallet.
   * @async
   * @returns {Promise<TokenAccount[]>} An array of token accounts.
   */
  async getOwnerTokenAccounts(wallet: Wallet, connection: Connection) {
    const walletTokenAccount = await  connection.getTokenAccountsByOwner(wallet.publicKey, {
      programId: TOKEN_PROGRAM_ID,
    })

    return walletTokenAccount.value.map((i) => ({
      pubkey: i.pubkey,
      programId: i.account.owner,
      accountInfo: SPL_ACCOUNT_LAYOUT.decode(i.account.data),
    }))
  }

  /**
   * Builds a swap transaction.
   * @async
   * @param {string} toToken - The mint address of the token to receive.
   * @param {number} amount - The amount of the token to swap.
   * @param {LiquidityPoolKeys} poolKeys - The liquidity pool keys.
   * @param {number} [maxLamports=100000] - The maximum lamports to use for transaction fees.
   * @param {boolean} [useVersionedTransaction=true] - Whether to use a versioned transaction.
   * @param {'in' | 'out'} [fixedSide='in'] - The fixed side of the swap ('in' or 'out').
   * @returns {Promise<Transaction | VersionedTransaction>} The constructed swap transaction.
   */
  async getSwapTransaction(
    toToken: string,
    // fromToken: string,
    amount: number,
    poolKeys: LiquidityPoolKeys,
    maxLamports: number = 100000,
    useVersionedTransaction = true,
    fixedSide: 'in' | 'out' = 'in',
    wallet: Wallet,
    connection: Connection
  ): Promise<Transaction | VersionedTransaction> {
    const directionIn = poolKeys.quoteMint.toString() == toToken
    const { minAmountOut, amountIn } = await this.calcAmountOut( connection, poolKeys, amount, directionIn)
    //console.log({ minAmountOut, amountIn });
    const userTokenAccounts = await this.getOwnerTokenAccounts(wallet, connection)
    const swapTransaction = await Liquidity.makeSwapInstructionSimple({
      connection: connection,
      makeTxVersion: useVersionedTransaction ? 0 : 1,
      poolKeys: {
        ...poolKeys,
      },
      userKeys: {
        tokenAccounts: userTokenAccounts,
        owner: wallet.publicKey,
      },
      amountIn: amountIn,
      amountOut: minAmountOut,
      fixedSide: fixedSide,
      config: {
        bypassAssociatedCheck: false,
      },
      computeBudgetConfig: {
        microLamports: maxLamports,
      },
    })

    const recentBlockhashForSwap = await connection.getLatestBlockhash()
    const instructions = swapTransaction.innerTransactions[0].instructions.filter(Boolean)

    if (useVersionedTransaction) {
      const versionedTransaction = new VersionedTransaction(
        new TransactionMessage({
          payerKey: wallet.publicKey,
          recentBlockhash: recentBlockhashForSwap.blockhash,
          instructions: instructions,
        }).compileToV0Message()
      )

      versionedTransaction.sign([wallet.payer])

      return versionedTransaction
    }

    const legacyTransaction = new Transaction({
      blockhash: recentBlockhashForSwap.blockhash,
      lastValidBlockHeight: recentBlockhashForSwap.lastValidBlockHeight,
      feePayer: wallet.publicKey,
    })

    legacyTransaction.add(...instructions)

    return legacyTransaction
  }

    /**
   * Sends a legacy transaction.
   * @async
   * @param {Transaction} tx - The transaction to send.
   * @returns {Promise<string>} The transaction ID.
   */
  async sendLegacyTransaction( connection: Connection, wallet: Wallet, tx: Transaction, maxRetries?: number) {
    const txid = await connection.sendTransaction(tx, [wallet.payer], {
      skipPreflight: true,
      maxRetries: maxRetries,
    })
    return txid
  }

    /**
   * Sends a versioned transaction.
   * @async
   * @param {VersionedTransaction} tx - The versioned transaction to send.
   * @returns {Promise<string>} The transaction ID.
   */
  async sendVersionedTransaction( connection: Connection , tx: VersionedTransaction, maxRetries?: number,) {
    const txid = await connection.sendTransaction(tx, {
      skipPreflight: true,
      maxRetries: maxRetries,
    })

    return txid
  }

 /**
   * Simulates a versioned transaction.
   * @async
   * @param {VersionedTransaction} tx - The versioned transaction to simulate.
   * @returns {Promise<any>} The simulation result.
   */
  async simulateLegacyTransaction( connection: Connection, tx: Transaction, wallet: Wallet) {
    const txid = await connection.simulateTransaction(tx, [wallet.payer])
    return txid
  }

    /**
   * Simulates a versioned transaction.
   * @async
   * @param {VersionedTransaction} tx - The versioned transaction to simulate.
   * @returns {Promise<any>} The simulation result.
   */
  async simulateVersionedTransaction( connection: Connection, tx: VersionedTransaction) {
    const txid = await connection.simulateTransaction(tx)

    return txid
  }

    /**
   * Gets a token account by owner and mint address.
   * @param {PublicKey} mint - The mint address of the token.
   * @returns {TokenAccount} The token account.
   */
  getTokenAccountByOwnerAndMint(mint: PublicKey) {
    return {
      programId: TOKEN_PROGRAM_ID,
      pubkey: PublicKey.default,
      accountInfo: {
        mint: mint,
        amount: 0,
      },
    } as unknown as TokenAccount
  }

    /**
   * Calculates the amount out for a swap.
   * @async
   * @param {LiquidityPoolKeys} poolKeys - The liquidity pool keys.
   * @param {number} rawAmountIn - The raw amount of the input token.
   * @param {boolean} swapInDirection - The direction of the swap (true for in, false for out).
   * @returns {Promise<Object>} The swap calculation result.
   */
  async calcAmountOut( connection: Connection, poolKeys: LiquidityPoolKeys, rawAmountIn: number, swapInDirection: boolean) {
    const poolInfo = await Liquidity.fetchInfo({ connection: connection, poolKeys })

    let currencyInMint = poolKeys.baseMint
    let currencyInDecimals = poolInfo.baseDecimals
    let currencyOutMint = poolKeys.quoteMint
    let currencyOutDecimals = poolInfo.quoteDecimals

    if (!swapInDirection) {
      currencyInMint = poolKeys.quoteMint
      currencyInDecimals = poolInfo.quoteDecimals
      currencyOutMint = poolKeys.baseMint
      currencyOutDecimals = poolInfo.baseDecimals
    }

    const currencyIn = new Token(TOKEN_PROGRAM_ID, currencyInMint, currencyInDecimals)
    const amountIn = new TokenAmount(currencyIn, rawAmountIn, false)
    const currencyOut = new Token(TOKEN_PROGRAM_ID, currencyOutMint, currencyOutDecimals)
    const slippage = new Percent(5, 100) // 5% slippage

    const { amountOut, minAmountOut, currentPrice, executionPrice, priceImpact, fee } = Liquidity.computeAmountOut({
      poolKeys,
      poolInfo,
      amountIn,
      currencyOut,
      slippage,
    })
    const numerator = new BN(amountOut.numerator).toNumber();  // hexadecimal input
    const denominator = new BN(amountOut.denominator).toNumber();  // hexadecimal input
    // Perform the division
    const baseValue = numerator / denominator;

    return {
      amountIn,
      amountOut,
      baseValue, 
      minAmountOut,
      currentPrice,
      executionPrice,
      priceImpact,
      fee,
    }
  }

async calcAmountOutForSOL(
  connection: Connection,
  poolKeys: LiquidityPoolKeys,
  AmountIn: number,
  inputToken: PublicKey
) {
  const poolInfo = await Liquidity.fetchInfo({ connection: connection, poolKeys });

  const currencyInMint = poolKeys.baseMint.equals(inputToken) ? poolKeys.baseMint : poolKeys.quoteMint;
  const currencyInDecimals = poolKeys.baseMint.equals(inputToken) ? poolInfo.baseDecimals :  poolInfo.quoteDecimals ;
  const currencyOutMint = poolKeys.quoteMint.equals(inputToken) ? poolKeys.baseMint : poolKeys.quoteMint ;
  const currencyOutDecimals = poolKeys.quoteMint.equals(inputToken) ? poolInfo.baseDecimals :  poolInfo.quoteDecimals;

  //console.log(inputToken.toString());
  
  //console.log(currencyInMint.toString(), currencyInDecimals);
  //console.log(currencyOutMint.toString(), currencyOutDecimals);
  
  
  //const rawAmountIn = AmountIn * Math.pow(10, currencyInDecimals);
  const currencyIn = new Token(TOKEN_PROGRAM_ID, currencyInMint, currencyInDecimals);
  
  const amountIn = new TokenAmount(currencyIn, AmountIn , false);
  const currencyOut = new Token(TOKEN_PROGRAM_ID, currencyOutMint, currencyOutDecimals);
  const slippage = new Percent(5, 100); // 5% slippage
  //console.log(amountIn.toFixed(), currencyInDecimals);
  
  const {
    amountOut,
    minAmountOut,
    currentPrice,
    executionPrice,
    priceImpact,
    fee
  } = Liquidity.computeAmountOut({
    poolKeys,
    poolInfo,
    amountIn,
    currencyOut,
    slippage,
  })

  const numerator = new BN(amountOut.numerator).toNumber();
  const denominator = new BN(amountOut.denominator).toNumber();
  const baseValue = numerator / denominator;
  console.log(amountOut.toFixed(), currencyOutDecimals);
  return {
    amountIn,
    amountOut,
    baseValue,
    minAmountOut,
    currentPrice,
    executionPrice,
    priceImpact,
    fee,
  };
}
}

export default RaydiumSwap
