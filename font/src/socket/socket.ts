import io from 'socket.io-client';
import { backEnd } from '../config';

const socket: SocketIOClient.Socket = io(backEnd,  {
    auth: {
        Authorization: "sdkfsdjh"
    },
  });

export default socket;