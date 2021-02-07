import { AudioStatus, MusicState, PlayerScreen } from './../types';
import { YoutubeAPIResponse, YoutubePlaylist } from '../types';
import { SAVE_PLAYLIST, SAVE_YOUTUBE, SET_ACTIVE_PLAYLIST, SET_CURRENT_SCREEN, SET_LOADING, SET_PLAYER_SCREEN, SET_MUSIC_STATE, SET_REFRESHING, SAVE_SEARCH, CLEAN_SEARCH, INIT_DB_PLAYLIST, START_TOAST, RESET_TOAST, SAVE_HOME, CLOSE_NEW_UPCOMING, NEW_UPCOMING, SET_AUDIO_SOUND, SET_AUDIO_STATUS } from './types';
import { PlaylistModel } from '../database/entities/playlist.model';
import { RecentModel } from '../database/entities/recent.model';
import { SongModel } from '../database/entities/song.model';
import { Audio } from 'expo-av';

export interface YoutubeReducerState  {
    data: YoutubeAPIResponse[];
    playlist: YoutubePlaylist[];
    active: YoutubePlaylist;
    loading: boolean;
    playlistTitle: string;
    player: PlayerScreen;
    currentScreen: String;
    prevActive: YoutubePlaylist;
    musicState: MusicState;
    refreshing: boolean;
    search: YoutubePlaylist[];
    myPlaylist: PlaylistModel[];
    toast: boolean;
    toastMessage: string;
    home: YoutubeAPIResponse[],
    recents: RecentModel[],
    toastData: SongModel,
    newUpcoming: boolean;
    newData: YoutubeAPIResponse[],
    audio: {
        sound: Audio.Sound;
        index: number;
        position: number;
        isPlay: boolean;
        finish: boolean;
        loaded: boolean;
    },
    pageMyPlaylist: boolean;
    audioStatus: AudioStatus;
    appReady: boolean;
}

const defaultState: YoutubeReducerState = {

    // API Landing page, this not really need
    data: [],

    // API Playlist
    playlist: [],

    // selected song
    active: null,
    loading: false,

    // required to playlist screen
    playlistTitle: '',

    // this is not required
    currentScreen: '',

    // this is not really need
    prevActive: null,
    musicState: MusicState.none,

    // This is not really need
    player: PlayerScreen.hide,
    refreshing: false,

    // data search
    search: [],

    // Playlist saved to local phone
    myPlaylist: [],

    // this not toast, this is BottomSheet
    toast: false,
    toastMessage: '',
    toastData: null,

    home: [],
    // RECENTS or HISTORY
    recents: [],
    // TAB HOME
    newUpcoming: false,
    newData: [],
    audio: {
        sound: null,
        index: 0,
        position: 0,
        isPlay: false,
        finish: false,
        loaded: false
    },
    audioStatus: null,
    // INDEX TS
    appReady: false,
    pageMyPlaylist: false
}

const reducers = (state = defaultState, action) => {
    switch (action.type) {
        case SAVE_YOUTUBE:
            return {
                ...state,
                data: action.payload,
            };
        case SAVE_HOME:
            return {
                ...state,
                home: action.payload
            }
        case SAVE_PLAYLIST:
            return {
                ...state,
                playlist: action.payload.data,
                playlistTitle: action.payload?.title || '',
                loading: false,
                refreshing: false
            }
        case SAVE_SEARCH:
            return {
                ...state,
                loading: false,
                search: action.payload.data
            }
        case CLEAN_SEARCH:
            return {
                ...state,
                search: []
            }
        case SET_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        case START_TOAST:
            return {
                ...state,
                toast: action.payload.toast,
                toastMessage: action.payload.toastMessage,
                toastData: action.payload.toastData
            }
        case RESET_TOAST:
            return {
                ...state,
                toast: false,
                toastMessage: '',
                toastData: null
            }
        case CLOSE_NEW_UPCOMING: {
            return {
                ...state,
                newUpcoming: false,
                newData: []
            }
        }

        case NEW_UPCOMING:
            return {
                ...state,
                newUpcoming: true,
                newData: action.payload
            }

        case SET_ACTIVE_PLAYLIST:
            const prevActive = state.active;
            const active = action.payload.data
            return {
                ...state,
                prevActive,
                active,
                playlistTitle: action.payload.title
            };
        case SET_MUSIC_STATE:
            return {
                ...state,
                musicState: action.payload
            }
        case SET_PLAYER_SCREEN:
            return {
                ...state,
                player: action.payload
            }
        case SET_REFRESHING:
            return {
                ...state,
                refreshing: action.payload
            }
        case SET_CURRENT_SCREEN:
            return {
                ...state,
                currentScreen: action.payload
            }
        case INIT_DB_PLAYLIST:
            return {
                ...state,
                myPlaylist: action.payload.pl,
                home: action.payload.initial,
                recents: action.payload.recents,
                appReady: true
            }
        case SET_AUDIO_SOUND:
            return {
                ...state,
                audio: {
                    ...state.audio,
                    sound: action.payload.sound
                }
            }
        case SET_AUDIO_STATUS:
            return {
                ...state,
                audioStatus: action.payload.audioStatus
            }
        default:
            return state;
    }
}

export default reducers;