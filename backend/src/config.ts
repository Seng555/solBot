import { LOOKUP_TABLE_CACHE, MAINNET_PROGRAM_ID, TxVersion } from "@raydium-io/raydium-sdk";

export const makeTxVersion = TxVersion.V0; // LEGACY
//export const wallet = Keypair.fromSecretKey(Buffer.from('<YOUR_WALLET_SECRET_KEY>'))

export const addLookupTableInfo = LOOKUP_TABLE_CACHE // only mainnet. other = undefined
export const PROGRAMIDS = MAINNET_PROGRAM_ID;