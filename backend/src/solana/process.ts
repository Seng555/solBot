import { Keypair, PublicKey } from "@solana/web3.js";
import { sendBack } from "../socket/socket";
import { connection } from "./cnn";
import { getPoolSize } from "./pool/getPoolsiz";
import RaydiumSwap from "./swap";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Wallet } from "@coral-xyz/anchor";
import { Percent, Token, TOKEN_PROGRAM_ID, TokenAmount } from "@raydium-io/raydium-sdk";
import { getWalletTokenAccount } from "./pool/util";
import { swapOnlyAmm } from "./pool/ammswapOnly";

export const Process = async (key: PublicKey) => {
    // const raydiumSwap = new RaydiumSwap();
    try {
      const poolInfo = await getPoolSize(connection, key);
      if (!poolInfo) {
        throw new Error("Liquidity Low, continue finding new pools.");
      } else {
        ///console.log("Pool info", poolInfo);
        const info = {
          "Pool info": ".....",
          "pairKey": poolInfo.pairKey,
          "baseMint": poolInfo.baseMint,
          "baseSize": poolInfo.baseSize,
          "quoteMint": poolInfo.quoteMint,
          "quoteSize": poolInfo.quoteSize,
        };
  
        //const poolKey = await  raydiumSwap.findPoolInfoForTokens(key.toString(), connection)
        //console.log(poolKey);
        sendBack({ type: 1, msg: info });
      }
    } catch (error: any) {
      console.error('Error processing pool:', error)
      sendBack({ type: 1, msg: error.message });
    }
  };

  export async function startSwap(data: formInfo) {
    try {
      const raydiumSwap = new RaydiumSwap();
      //console.log(data);
      const poolKey = await raydiumSwap.findPoolInfoForTokens(data.pair, connection);
      if (!poolKey) {
        return sendBack({ type: 0, msg: "Pool key not found" });
      }
      //return
  
      const keypair = Keypair.fromSecretKey(bs58.decode(data.privateKey));
      const wallet: Wallet = new Wallet(keypair);
  
      // quote token
      const inputToken = data.quote.toLowerCase() == poolKey.quoteMint.toString().toLowerCase()
        ? new Token(TOKEN_PROGRAM_ID, poolKey.quoteMint, poolKey.quoteDecimals)
        : new Token(TOKEN_PROGRAM_ID, poolKey.baseMint, poolKey.baseDecimals);
      // base token
      const outputToken = data.quote.toLowerCase() == poolKey.baseMint.toString().toLowerCase()
        ? new Token(TOKEN_PROGRAM_ID, poolKey.quoteMint, poolKey.quoteDecimals)
        : new Token(TOKEN_PROGRAM_ID, poolKey.baseMint, poolKey.baseDecimals)
  
      const targetPool = poolKey.id.toString() // USDC-RAY pool
      const inputTokenAmount = new TokenAmount(inputToken, data.spend * Math.pow(10, inputToken.decimals))
      const slippage = new Percent(15, 1000); // 1.5% slippage
      const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey)
  
      /*console.log(inputToken);
      console.log(outputToken);
      console.log(inputTokenAmount.toFixed(), slippage.toFixed());*/
      const { txids } = await swapOnlyAmm({
        outputToken,
        targetPool,
        inputTokenAmount,
        slippage,
        walletTokenAccounts,
        wallet: keypair,
      }, poolKey)
      const token = poolKey.quoteMint.toString().toLowerCase() == data.quote.toLowerCase()
        ? poolKey.baseMint.toString()
        : poolKey.quoteMint.toString();
      //console.log('txids', txids)
      return sendBack({ type: 5, msg: "Done", pair: data.pair, txids, token, spend: data.spend }); // on Done
    } catch (error: any) {
      console.log(":sddsds", error);
      
      return sendBack({ type: 0, msg: error.message });
    }
  
  }
  