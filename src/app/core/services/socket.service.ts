import { Injectable } from '@angular/core';
import * as SocketIo from 'socket.io-client';

@Injectable()
export class SocketService {
    private io?: SocketIOClient.Socket;

    public initIo(url: string, onReady: (socket: SocketIOClient.Socket) => void) {
        this.io = SocketIo(url);
        onReady(this.io);
    }
}
