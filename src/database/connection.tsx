import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Connection, createConnection, getConnection } from "typeorm/browser";
import { PlaylistModel } from "./entities/playlist.model";
import { SongModel } from "./entities/song.model";
import { PlaylistRepository } from "./repository/PlaylistRepository";
import { SongRepository } from "./repository/SongRepository";
// import * as ExpoSQLite from 'expo-sqlite'
import Loading from "../component/loading";
import { InitialPageModel } from "./entities/initial.model";
import { ItemsModel } from "./entities/items.model";
import { InitialPageRepository } from "./repository/InitialPageRepository";
import { RecentRepository } from "./repository/recentRepository";
import { RecentModel } from "./entities/recent.model";

interface DatabaseConnectionContextData {
    playlistRepo: PlaylistRepository;
    songRepo: SongRepository;
    initialRepo: InitialPageRepository;
    recentRepo: RecentRepository
}

const DatabaseConnectionContext = createContext<DatabaseConnectionContextData>(
  {} as DatabaseConnectionContextData,
);

export const DatabaseConnectionProvider: React.FC = ({children}) => {
    const [connection, setConnection] = useState<Connection | null>(null);
    const connect = useCallback(async () => {
        try {
            const createdConnection = await createConnection({
                type: 'expo',
                database: 'imusicv1.db',
                driver: require('expo-sqlite'),
                entities: [
                    PlaylistModel,
                    SongModel,
                    InitialPageModel,
                    ItemsModel,
                    RecentModel
                ],
                synchronize: true,
                logger: "debug",
                logging: "all"
            });
            if(!createdConnection) {
                try {
                    const conn = await getConnection();
                    setConnection(conn)
                    return 1
                } catch (error) {
                    return null
                }
            }

            setConnection(createdConnection)
            return 1
        } catch (error) {
        }
    }, [])

    useEffect(() => {
        if(!connection) {
            connect()
        }
    }, [])

    if (!connection) {
        return <Loading/>;
    }

    return (
        <DatabaseConnectionContext.Provider
            value={{
                playlistRepo: new PlaylistRepository(connection),
                songRepo: new SongRepository(connection),
                initialRepo: new InitialPageRepository(connection),
                recentRepo: new RecentRepository(connection)
            }}
        >
            {children}
        </DatabaseConnectionContext.Provider>
    )
}

export function useDatabaseConnection() {
    const context = useContext(DatabaseConnectionContext);

    return context;
}