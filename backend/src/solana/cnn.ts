import { Connection } from "@solana/web3.js";

/*export const connection = new Connection('https://api.mainnet-beta.solana.com', {
        wsEndpoint: 'wss://api.mainnet-beta.solana.com',
    });*/
export const connection = new Connection('https://solana-mainnet.core.chainstack.com/6a0a57744ec2cacdb1a6ed9fb77e2b42', {
    wsEndpoint: 'wss://solana-mainnet.core.chainstack.com/6a0a57744ec2cacdb1a6ed9fb77e2b42',
});

export const getLatestBlock = async () => {
    try {
        // Get the latest slot
        const latestSlot = await connection.getSlot();
       
        // Fetch the block details with maxSupportedTransactionVersion set to 0
        const latestBlock = await connection.getBlock(latestSlot, {
            maxSupportedTransactionVersion: 0,
        });
        console.log("Latest Block:", latestBlock);
        return latestBlock;
    } catch (error) {
        console.error("Error fetching the latest block:", error);
        return null;
    }
};