
import { Connection } from "@solana/web3.js";
import { RAYDIUM_LIQUIDITY_PROGRAM_ID_V4 } from "./liquidity";
import { sendBack } from "../socket/socket";
import { Process } from "./process";

let subscription: any;
export function subscribeToProgramAccount(solanaConnection: Connection): void {
    //3JKHwCMdJMUAxQRCCYQUkKyjmAq5rffcJub4U5wk6mqam7DMVPpt66QNTqVTGcWK81no6EyTXkX5HkR7kjVifGXX
    //58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2
    //Process(new PublicKey("58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"))
    //fetchRaydiumMints("3wFx3Rz2HPZZVRoJUPevPGwQQ3afWNu6nQjhEELxB9TRPM2a7g7FesQDzAJRMb6ycbipbAVdChFCxF3f9AeF9koC", solanaConnection)
    console.log("Start");

    subscription = solanaConnection.onLogs(
        RAYDIUM_LIQUIDITY_PROGRAM_ID_V4,
        async ({ logs, err, signature }) => {
            if (err) return
            console.log("New log txId: ", signature);
            if (logs && logs.some(log => log.includes("initialize2"))) {
                console.log("Signature for 'initialize2':", `${signature}`);
                fetchRaydiumMints(signature, solanaConnection)
                solanaConnection.removeOnLogsListener(subscription)
            }
        },
        "confirmed"
    );
};

export function stopSub(solanaConnection: Connection): void { console.log("stop");

    solanaConnection.removeOnLogsListener(subscription)
};

let time = 0;

async function fetchRaydiumMints(txId: string, connection: Connection) {
    try {
        const tx = await connection.getParsedTransaction(txId, { maxSupportedTransactionVersion: 0 });

        if (!tx && time < 10) {
            time += 1;
            console.log(`Retry attempt ${time}: Transaction not found, retrying in 1 second...`);
            return setTimeout(() => fetchRaydiumMints(txId, connection), 1000);
        }
        time = 0;


        // Check if the transaction contains any inner instructions
        if (!tx?.meta?.innerInstructions || tx.meta.innerInstructions.length === 0) {
            console.log({ msg: "No inner instructions found." });
            return sendBack({ type: 4, msg: "New pool, No inner instructions found." }); // Adjust sendBack as per your implementation
        }

        //@ts-ignore
        const accounts = (tx?.transaction.message.instructions).find(ix => ix.programId.toBase58() === RAYDIUM_LIQUIDITY_PROGRAM_ID_V4.toBase58()).accounts as PublicKey[];

        if (!accounts) {
            return sendBack({ msg: "No accounts found in the transaction." });
        }
        //console.log(JSON.stringify(accounts));
        const tokenAIndex = 8;
        const tokenBIndex = 9;

        const pairAddress = accounts[4];
        const tokenAAccount = accounts[tokenAIndex];
        const tokenBAccount = accounts[tokenBIndex];

        const displayData = {
            "Pair": pairAddress.toBase58(),
            "Token A": tokenAAccount.toBase58(),
            "Token B": tokenBAccount.toBase58()
        };

        //console.log("New LP Found");
        //console.table(displayData);
        sendBack({ msg: displayData });
        return Process(pairAddress)
    } catch (error: any) {
        console.error(error);
        return sendBack({ type: 0, msg: error.message });
    }
}