import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm/browser";
import { InitialPageModel } from "./initial.model";

@Entity('itemsmodel')
export class ItemsModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    playlistId: string;

    @Column()
    thumbnail: string;

    @ManyToOne((type) => InitialPageModel, (initialPage) => initialPage.items)
    initialPage: InitialPageModel
}