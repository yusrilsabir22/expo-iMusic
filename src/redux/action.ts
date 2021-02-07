import { FETCH_YOUTUBE, FETCH_SEARCH, FETCH_PLAYLIST, SET_PLAYER_SCREEN, SET_CURRENT_SCREEN, START_TOAST } from './types';

export const fetchYoutube = () => {
    return {
        type: FETCH_YOUTUBE,
    }
}

/**
 *
 * @param payload is id_playlist
 */
export const fetchPlaylist = (payload) => {
    return {
        type: FETCH_PLAYLIST,
        payload,
    }
}

/**
 *
 * @param payload is query_search
 */
export const fetchSearch = (payload) => {
    return {
        type: FETCH_SEARCH,
        payload,
    }
}

/**
 *
 * @param payload is enum PlayerScreen
 * @see src/types.ts
 */

export const setPlayerScreen = (payload) => {
    return {
        type: SET_PLAYER_SCREEN,
        payload
    }
}

export const setCurrentScreen = (payload) => {
    return {
        type: SET_CURRENT_SCREEN,
        payload
    }
}

export const showToast = (message: string) => {
    return {
        type: START_TOAST,
        payload: {
            toast: true,
            toastMessage: message
        }
    }
}