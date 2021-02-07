// import TrackPlayer from 'react-native-track-player'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {Audio} from 'expo-av'
import { timeMilisToSec } from '../utils/time'

export const useTrackPlayerStatus = (sound: Audio.Sound) => {
    const [isPlay, setIsPlay] = useState(false)
    const [position, setPosition] = useState(0)
    const [finish, setFinish] = useState(false)
    const [loaded, setLoaded] = useState(false)


    if(sound !== null) {
        sound._onPlaybackStatusUpdate = function(stat: any) {
            setLoaded(stat.isLoaded)
            setIsPlay(stat.isPlaying)
            setPosition(timeMilisToSec(stat.positionMillis))
            setFinish(stat.didJustFinish)
        }
    }

    return useMemo(() => {
        return {
            isPlay: isPlay || false,
            position: position || 0,
            finish: finish || false,
            loaded: loaded || false
        }
    }, [isPlay, position, finish, loaded])

}