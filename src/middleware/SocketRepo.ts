import { YoutubePlaylist } from '../types';

const SocketEvents = {
    DATA_SEARCHING: 'data-searching',
    DATA_SCROLL: 'data-scroll',
    DATA_MUSIC: 'data-music'
}

export class SocketRepo {
    private socket: SocketIOClient.Socket;

    constructor(conn: SocketIOClient.Socket) {
        if(conn) this.socket = conn;
        this.onDataSearching = this.onDataSearching.bind(this);
        this.onScroll = this.onScroll.bind(this)
        this.emit = this.emit.bind(this)
    }

    public onDataSearching(cb: (data: YoutubePlaylist[]) => void) {
        this.socket.on(SocketEvents.DATA_SEARCHING, (data: YoutubePlaylist[]) => {
            cb(data)
        })
    }

    public onScroll(cb: (data: YoutubePlaylist[]) => void) {
        this.socket.on(SocketEvents.DATA_SCROLL, (data: YoutubePlaylist[]) => {
            cb(data)
        })
    }

    public emit(type: 'searching' | 'scroll-down', payload?: any) {
        this.socket.emit(type, payload)
    }

}