import AV, { Audio } from "expo-av";
import { PlaylistModel } from "../database/entities/playlist.model";
import { YoutubePlaylist } from "../types";
import { music_URL } from "../utils/constants";
import { timeMilisToSec } from "../utils/time";

export type TrackPlayerStat = {
    position: number;
    isPlay: boolean;
    finish: boolean;
    loaded: boolean;
}

export class AudioTrackPlayer {
    static sound: Audio.Sound;

    static playlists: YoutubePlaylist[];

    static song: YoutubePlaylist;

    static index: number;

    static position: number;

    static isPlay: boolean;

    static finish: boolean;

    static loaded: boolean;

    constructor() {
        Audio.setAudioModeAsync({
            staysActiveInBackground: true
        });
    }

    public static setPlaylists(playlists: YoutubePlaylist[]) {
        this.playlists = playlists;
    }

    public static setIndex(index: number) {
        this.index = index
    }

    public static setIsPlay(isPlay: boolean) {
        this.isPlay = isPlay;
    }

    public static setFinish(finish: boolean) {
        this.finish = finish;
    }

    public static setPosition(position: number) {
        this.position = position;
    }

    public static setLoaded(loaded: boolean) {
        this.loaded = loaded;
    }

    public static setSong(song: YoutubePlaylist) {
        this.song = song;
    }

    public static async init() {
        const active = this.playlists[this.index]
        const {sound} = await Audio.Sound.createAsync({uri: music_URL+'play?uc='+active.videoId})
        await sound.setProgressUpdateIntervalAsync(1000)
        this.sound = sound;
        this.play();
        this.getPlaybackStatus();
    }

    public static async pause() {
        await this.sound.pauseAsync();
    }

    public static async replay() {
        await this.sound.replayAsync({positionMillis: 0, progressUpdateIntervalMillis: 1000});
    }

    public static async play() {
        await this.sound.playAsync();
    }

    public static async next() {
        if(this.index <= (this.playlists.length - 1)) {
            this.setIndex(this.index+1)
            this.init();
        }
    }

    public static async prev() {
        if(this.index > 1) {
            this.setIndex(this.index - 1)
            this.init()
        }
    }

    public static async stop() {
        await this.sound.unloadAsync()
    }

    public static getPlaybackStatus(playbackStatus?: (data: TrackPlayerStat) => void) {
        if(this.sound !== null) {
            this.sound._onPlaybackStatusUpdate = (status: any) => {
                const stat: TrackPlayerStat = {
                    position: timeMilisToSec(status.positionMillis),
                    isPlay: status.isPlaying as boolean,
                    loaded: status.isLoaded as boolean,
                    finish: status.finish as boolean
                }
    
                this.setPosition(stat.position)
                this.setIsPlay(stat.isPlay)
                this.setLoaded(stat.loaded)
                this.setFinish(stat.finish)
    
                if(stat.finish) {
                    this.next()
                };
    
                playbackStatus && playbackStatus({...stat});
            }
        }
    }

    public static statListener() {
        this.sound._onPlaybackStatusUpdate
    }

    public status 
}