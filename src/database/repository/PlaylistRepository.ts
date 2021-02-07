import { Connection, Repository } from "typeorm/browser";
import { PlaylistModel } from "../entities/playlist.model";


export class PlaylistRepository {
    private ormRepo: Repository<PlaylistModel>;

    constructor(conn: Connection) {
        if(conn !== null) this.ormRepo = conn.getRepository(PlaylistModel);
        this.getAll = this.getAll.bind(this)
        this.create = this.create.bind(this)
        this.getOne = this.getOne.bind(this)
    }

    public async getAll(): Promise<PlaylistModel[]> {
        try {
            const playlists = await this.ormRepo.find({relations: ['items']})
            return playlists
        } catch (error) {
            return Promise.resolve([])
        }
    }

    public async create(name: string): Promise<PlaylistModel> {
        const playlist = this.ormRepo.create({cardTitle: name})

        const results = await this.ormRepo.save(playlist);

        return results ;
    }

    public async getOne(id: number) {
        const playlist = await this.ormRepo.find({where: {id: id}})
        return playlist[0]
    }
}