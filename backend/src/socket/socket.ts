import { IncomingMessage, Server, ServerResponse } from "http";
import { DefaultEventsMap, Socket, Server as SocketServer } from 'socket.io'; // Import for Socket.IO
import { stopSub, subscribeToProgramAccount } from "../solana/sub";
import { connection } from "../solana/cnn";
import { startSwap } from "../solana/process";

let io: SocketServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export const socketSetup = async (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
     io = new SocketServer(server, {
        cors: {
            origin: "*", // Allow all origins
            methods: ["GET", "POST"], // Allow specific HTTP methods
            allowedHeaders: ["Authorization"], // Allow specific headers
            credentials: true, // Allow credentials if needed
        },
    });
    // Socket.IO setup
    io.on("connection", (socket: Socket) => {
        console.log(`Client connected: ${socket.id}`);
        socket.to(socket.id).emit("hello", `Hello! ${socket.id}`)
        // Optionally associate a user with the socket ID
        socket.on("register", (userId: string) => {
            console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
        });
        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
        socket.on("start", () => {
            // console.log(`Start ${id}` );
             subscribeToProgramAccount(connection)
        });
        socket.on("stop", () => {
            console.log(`stopSub` );
            stopSub(connection)
       });
        socket.on('sniper', (data: formInfo) => {
            //console.log('Socket sniper', data);
            startSwap(data)
            // subNewAmmPool();
        });
    });
};

export const sendBack = (data: any) => {
    if (!io) {
        throw new Error('Socket.IO has not been initialized');
    }
    // console.log(data);

    io.emit("smg", data); // Emit message to all connected clients
};