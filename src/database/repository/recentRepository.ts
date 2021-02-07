import { Connection, Repository } from "typeorm/browser";
import { YoutubePlaylist } from "../../types";
import { RecentModel } from "../entities/recent.model";


export class RecentRepository {
    private ormRepo: Repository<RecentModel>;

    constructor(conn: Connection) {
        if(conn !== null) this.ormRepo = conn.getRepository(RecentModel);
        this.getAll = this.getAll.bind(this)
        this.create = this.create.bind(this)
        this.getOne = this.getOne.bind(this)
    }

    public async getAll(): Promise<RecentModel[]> {
        try {
            const playlists = await this.ormRepo.find()
            return playlists
        } catch (error) {
            return Promise.resolve([])
        }
    }

    public async create(data: YoutubePlaylist): Promise<RecentModel> {
        const playlist = this.ormRepo.create(data)

        const results = await this.ormRepo.save(playlist);

        return results ;
    }

    public async getOne(id: number) {
        const playlist = await this.ormRepo.find({where: {id: id}})
        return playlist[0]
    }

    public async clearRecents() {
        try {
            await this.ormRepo.clear()
            return true
        } catch (error) {
            return false
        }
    }
}