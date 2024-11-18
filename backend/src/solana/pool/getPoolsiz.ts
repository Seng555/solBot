import { OpenOrders } from "@project-serum/serum";
import { LIQUIDITY_STATE_LAYOUT_V4 } from "@raydium-io/raydium-sdk";
import { Connection, PublicKey } from "@solana/web3.js";

// PoolPubkey Pair pubkey
export const getPoolSize =  async (solanaConnection: Connection, PoolPubkey: PublicKey  ) =>{
    try {
        const accountInfo = await solanaConnection.getAccountInfo(PoolPubkey)
        if(accountInfo){
            const poolState = LIQUIDITY_STATE_LAYOUT_V4.decode(accountInfo.data);
            const openOrders = await OpenOrders.load(
                solanaConnection,
                poolState.openOrders,
                poolState.marketProgramId // OPENBOOK_PROGRAM_ID(marketProgramId) of each pool can get from api: https://api.raydium.io/v2/sdk/liquidity/mainnet.json
            );
            const baseDecimal = 10 ** poolState.baseDecimal.toNumber(); // e.g. 10 ^ 6
            const quoteDecimal = 10 ** poolState.quoteDecimal.toNumber();
            const baseTokenAmount = await solanaConnection.getTokenAccountBalance(poolState.baseVault);
            const quoteTokenAmount = await solanaConnection.getTokenAccountBalance(poolState.quoteVault);
    
            const basePnl = poolState.baseNeedTakePnl.toNumber() / baseDecimal;
            const quotePnl = poolState.quoteNeedTakePnl.toNumber() / quoteDecimal;
            const openOrdersBaseTokenTotal = openOrders.baseTokenTotal.toNumber() / baseDecimal;
            const openOrdersQuoteTokenTotal = openOrders.quoteTokenTotal.toNumber() / quoteDecimal;
    
            const base = (baseTokenAmount.value?.uiAmount || 0) + openOrdersBaseTokenTotal - basePnl;
            const quote = (quoteTokenAmount.value?.uiAmount || 0) + openOrdersQuoteTokenTotal - quotePnl;
            //console.log(poolState);
            
            //const denominator = new BN(10).pow(poolState.baseDecimal);
    
            // const addedLpAccount = tokenAccounts.find((a) => a.accountInfo.mint.equals(poolState.lpMint) );
            /*console.log("SOL_USDC pool info:")
            console.log("pool total base " + base,)
            console.log("pool total quote " + quote)
    
            console.log("base vault balance " + baseTokenAmount.value.uiAmount,)
            console.log("quote vault balance " + quoteTokenAmount.value.uiAmount,)
    
            console.log("base tokens in openorders " + openOrdersBaseTokenTotal,)
            console.log("quote tokens in openorders  " + openOrdersQuoteTokenTotal,)
    
            console.log("base token decimals " + poolState.baseDecimal.toNumber(),)
            console.log("quote token decimals " + poolState.quoteDecimal.toNumber(),)
            console.log( "total lp " + poolState.lpReserve.div(denominator).toString())*/
            return {
                pairKey: PoolPubkey.toString(),
                baseMint: poolState.baseMint,
                baseSize: base,
                quoteMint: poolState.quoteMint,
                quoteSize : quote
            }
        }else{
            return null
        }  
    } catch (error) {
        console.error('Error:', error);
        return null
    }
}