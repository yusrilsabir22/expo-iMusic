import { Connection, Repository } from "typeorm/browser";
import { YoutubeAPIResponse } from "../../types";
import { InitialPageModel } from "../entities/initial.model";
import { ItemsModel } from "../entities/items.model";

type Data = {
    cardTitle: string;
    items: {
        title: string;
        thumbnail: string;
        playlistId: string;
    }[]
}

export class InitialPageRepository {
    private ormRepo: Repository<InitialPageModel>;
    private itemsRepo: Repository<ItemsModel>;
    private connection: Connection;

    constructor(conn: Connection) {
        if(conn !== null) {
            this.ormRepo = conn.getRepository(InitialPageModel)
            this.itemsRepo = conn.getRepository(ItemsModel);
            this.connection = conn;
        };

        this.getAll = this.getAll.bind(this)
        this.update = this.update.bind(this)
    }

    public async getAll(): Promise<InitialPageModel[]> {
        try {
            const initialPages = await this.ormRepo.find({relations: ['items']});
            return initialPages;
        } catch (error) {
            return Promise.resolve([]);
        }
    }

    public async update(data: YoutubeAPIResponse[]): Promise<boolean> {
        if(this.connection) {
            const queryRunner = this.connection.createQueryRunner();
            await queryRunner.startTransaction();
            try {
                await queryRunner.manager.clear(InitialPageModel)
                await queryRunner.manager.clear(ItemsModel);
                Array.from(data).map(async (val) => {
                    const initID = await queryRunner.manager.insert(InitialPageModel, val)
                    const initial = await queryRunner.manager.findOne(InitialPageModel, {where: {id: initID.raw}})
                    Array.from(val.items).map(async (v) => {
                        await queryRunner.manager.insert(ItemsModel, {...v, initialPage: initial });
                    });
                });
                await queryRunner.commitTransaction()
                return true;
            } catch (error) {
                queryRunner.rollbackTransaction()
                return false;
            } finally {
                await queryRunner.release()
            }
        } else {
        }
    }
}