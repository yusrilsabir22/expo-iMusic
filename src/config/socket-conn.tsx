
import React, { useEffect, createContext, useCallback, useState, useContext } from 'react'
import io from 'socket.io-client'
import { SocketRepo } from '../middleware/SocketRepo';
import { YoutubePlaylist } from '../types';
import { music_URL } from '../utils/constants'

interface SocketConnectionCotextData {
    socket: SocketRepo
}

const SocketIOConnectionContext = createContext<SocketConnectionCotextData>(
    {} as SocketConnectionCotextData,
);



export const SocketIOConnProvider: React.FC = ({children}) => {

    const [connection, setConnection] = useState<SocketIOClient.Socket>(null)

    const connected = useCallback(() => {
        const connect = io(music_URL)
        // connect.on()
        connect.emit('status')
        setConnection(connect)
    }, [])


    useEffect(() => {
        if(!connection) {
            connected()
        }
    }, [connected, connection])
    return (
        <SocketIOConnectionContext.Provider
            value={{
                socket: new SocketRepo(connection)
            }}
        >
            {children}
        </SocketIOConnectionContext.Provider>
    )
}

export function useSocketConnection() {
    const context = useContext(SocketIOConnectionContext);
    return context.socket;
}

export function useSocketOnScroll() {
    const {onScroll} = useSocketConnection()
    const [data, setData] = useState<YoutubePlaylist[]>([])

    const listening = useCallback(() => {
        onScroll((data) => setData(data))
    }, [])

    useEffect(() => {
        listening()
    }, [])

    return data
}

export function useSocketOnSearch() {
     const {onDataSearching} = useSocketConnection()
    const [data, setData] = useState<YoutubePlaylist[]>([])

    const listening = useCallback(() => {
        onDataSearching((data) => setData(data))
    }, [])

    useEffect(() => {
        listening()
    }, [])

    return data
}