import { RecentRepository } from './../database/repository/recentRepository';
import { APIResponse, YoutubeAPIResponse, YoutubePlaylist } from './../types';
import { SAVE_YOUTUBE, FETCH_YOUTUBE, SAVE_PLAYLIST, FETCH_PLAYLIST, SET_LOADING, SET_REFRESHING, SAVE_SEARCH, FETCH_SEARCH, INIT_DB_PLAYLIST, INIT_DB, START_TOAST, LOAD_HOME, NEW_UPCOMING, SAVE_UPCOMING, CLOSE_NEW_UPCOMING } from './types';
import {call, put, takeLatest} from 'redux-saga/effects'
import Service from '../middleware/Service'
import { PlaylistModel } from '../database/entities/playlist.model';
import { PlaylistRepository } from '../database/repository/PlaylistRepository';
import { SongRepository } from '../database/repository/SongRepository';
import { SongModel } from '../database/entities/song.model';
import { InitialPageRepository } from '../database/repository/InitialPageRepository';
import { InitialPageModel } from '../database/entities/initial.model';
import { RecentModel } from '../database/entities/recent.model';

function* onFetchYoutube(_action: any) {
    try {
        const {initialRepo, refresh}: {initialRepo: InitialPageRepository, refresh: boolean} = _action.payload
        const playlistRepo: PlaylistRepository = _action.payload.playlistRepo;
        const songRepo: SongRepository = _action.payload.songRepo;
        const recentRepo: RecentRepository = _action.payload.recentRepo

        if(refresh) {
            const res: APIResponse<YoutubeAPIResponse[]> = yield call(Service.GET, 'youtube');
            if(initialRepo && initialRepo.update) {
                const res1: InitialPageModel[] = yield call(initialRepo.getAll)
                if(res1[0].cardTitle !== res.data[0].cardTitle && res1.length !== res.data.length) {
                    yield put({type: NEW_UPCOMING, payload: res.data})
                }
            }
        } else {
            const stat = yield call(initialRepo.getAll)
            if(stat.length > 0) {
                yield put({type: INIT_DB, payload: {initialRepo, playlistRepo, songRepo, recentRepo}})
            } else {
                const res: APIResponse<YoutubeAPIResponse[]> = yield call(Service.GET, 'youtube');
                const data = yield call(initialRepo.update, res.data)
                if(data) {
                    yield put({type: INIT_DB, payload: {initialRepo, playlistRepo, songRepo, recentRepo}})
                }
            }
        }



    } catch (error) {
        yield put({type: SET_REFRESHING, payload: false});
        console.log('error', error)
    }
}

function* updateUpcoming(action: any) {
    try {
        const newData: YoutubeAPIResponse[] = action.payload.newData
        const initialRepo: InitialPageRepository = action.payload.initialRepo
        const playlistRepo: PlaylistRepository = action.payload.playlistRepo;
        const songRepo: SongRepository = action.payload.songRepo;
        const recentRepo: RecentRepository = action.payload.recentRepo
        const success = yield call(initialRepo.update, newData)
        if(success) {
            yield put({type: INIT_DB,payload: {initialRepo, playlistRepo, songRepo, recentRepo}})
            yield put({type: CLOSE_NEW_UPCOMING})
        } else {
            yield put({type: CLOSE_NEW_UPCOMING})
        }
    } catch (error) {
    }
}

function* onFetchPlaylist(action: any) {
    try {
        yield put({type: SET_LOADING, payload: true})
        const res: APIResponse<YoutubePlaylist[]> = yield call(Service.GET, `playlist?list=${action.payload}`);
        if(res.data.length > 0 && !res.data[0].error) {
            yield put({type: SAVE_PLAYLIST, payload: {data: res.data, title: ''}});
        }
    } catch (error) {
        yield put({type: SET_REFRESHING, payload: false});
        yield put({type: SET_LOADING, payload: false})
    }
}

function* onFetchSearch(action: any) {
    try {
        const res: APIResponse<YoutubePlaylist[]> = yield call(Service.GET, `search?q=${action.payload}`);
        yield put({type: SAVE_SEARCH, payload: {data: res.data, title: ''}});
    } catch (error) {
        yield put({type: SET_REFRESHING, payload: false});
        yield put({type: SET_LOADING, payload: false})
    }
}

function* onInitDB(action: any) {
    try {
        const pl: PlaylistRepository = action.payload.playlistRepo;
        const sg: SongRepository = action.payload.songRepo;
        const initial: InitialPageRepository = action.payload.initialRepo;
        const recent: RecentRepository = action.payload.recentRepo

        const resPL: PlaylistModel[] = yield call(pl.getAll)
        const resSG: SongModel[] = yield call(sg.getAll)
        const resInitial: InitialPageModel[] = yield call(initial.getAll)
        const resRecent: RecentModel[] = yield call(recent.getAll)
        yield put({type: INIT_DB_PLAYLIST, payload: {pl: resPL, sg: resSG, initial: resInitial, recents: resRecent.reverse()}})
    } catch (error) {
    }
}

function* onInitHome(action: any) {
    try {
        const initialRepo = action.payload
        const res = yield call(initialRepo.getAll)
        yield put({type: SAVE_PLAYLIST, payload: res})
    } catch (error) {
        yield put({type: START_TOAST, payload: {toast: true, toastMessage: 'Failed to update home playlist'}})
    }
}

export function* watchYoutube() {
    yield takeLatest(FETCH_YOUTUBE, onFetchYoutube);
    yield takeLatest(FETCH_PLAYLIST, onFetchPlaylist);
    yield takeLatest(FETCH_SEARCH, onFetchSearch);
    yield takeLatest(INIT_DB, onInitDB);
    yield takeLatest(LOAD_HOME, onInitHome);
    yield takeLatest(SAVE_UPCOMING, updateUpcoming)
}