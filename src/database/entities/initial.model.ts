import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm/browser";
import { ItemsModel } from "./items.model";

@Entity('initialpage')
export class InitialPageModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cardTitle: string;

    @OneToMany((type) => ItemsModel, (itemsModel) => itemsModel.initialPage)
    @JoinColumn()
    items: ItemsModel[]
}