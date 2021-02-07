import { MainScreenNavigationProp, MainScreenRouteProps } from './config/navigation';
export type GlobalProps = {
    navigation: MainScreenNavigationProp;
    route: MainScreenRouteProps;
}

export type ListPlaylist = {
    title: string;
    thumbnail: string;
    playlistId: string;
}

/**
 * Method GET
 */
export interface YoutubeAPIResponse {
    cardTitle: string
    items: ListPlaylist[]
}

/**
 * @description Method GET
 */
export type YoutubePlaylist = {
    title: string;
    owner: string;
    videoId: string;
    durationText: string;
    durationNumber: number;
    thumbnail: string;
    error?: string;
}

export interface APIResponse<T> {
    data: T;
    status: number
}

export enum PlayerScreen {
    show = 'SHOW',
    hide = 'HIDE',
    full = 'FULL',
    mini = 'MINI'
}

export enum MusicState {
    new = "new",
    none = "none",
    open = "open"
}

export interface AudioStatus {
    status: "play" | "pause" | "resume" | "replay" | null
}