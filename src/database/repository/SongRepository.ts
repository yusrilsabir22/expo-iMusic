import { Connection, Repository } from "typeorm/browser";
import { PlaylistModel } from "../entities/playlist.model";
import { SongModel } from "../entities/song.model";
import { YoutubePlaylist } from "../../types";

export class SongRepository {
    private ormRepo: Repository<SongModel>;

    constructor(conn: Connection) {
        if(conn !== null) this.ormRepo = conn.getRepository(SongModel);
        this.getAll = this.getAll.bind(this)
        this.create = this.create.bind(this)
    }

    public async getAll(): Promise<SongModel[]> {
        const songs = await this.ormRepo.find({})

        return songs
    }

    public async create(data: YoutubePlaylist & {playlistMusic: PlaylistModel}): Promise<SongModel> {
        const song = this.ormRepo.create(data)

        const results = await this.ormRepo.save(song)

        return results;
    }

    public async delete(videoId: string) {
        const song = await this.ormRepo.delete({videoId})
        return song;
    }
}