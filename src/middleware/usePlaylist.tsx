import React, { useCallback, useEffect, useState } from 'react'
import { useDatabaseConnection } from '../database/connection'
import { PlaylistModel } from '../database/entities/playlist.model'

const usePlaylist = (props) => {
    const {playlistRepo} = useDatabaseConnection()

    const [playlists, setPlaylists] = useState<PlaylistModel[]>([])

    const loadAllPlaylist = useCallback(async () => {
        const pl = await playlistRepo.getAll();
        setPlaylists(pl)
    }, [])

    useEffect(() => {
        if(props.route.name === 'MyPlaylist') {
            // loadAllPlaylist()
        }
    }, [props])

    return playlists
}

export default usePlaylist
