import { Connection, PublicKey } from "@solana/web3.js";


export async function getTokenAccountBalance(connection: Connection, tokenAccountAddress: PublicKey) {
    try {
        // Fetch the token account balance
        const tokenAccountInfo = await connection.getTokenAccountBalance(tokenAccountAddress);

        // Extract the balance from the response
        const balance = tokenAccountInfo.value.uiAmount;

        return balance;
    } catch (error) {
        console.error('Error getting token account balance:', error);
        return null;
    }
}