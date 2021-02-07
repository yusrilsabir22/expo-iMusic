import { Column, Entity, PrimaryGeneratedColumn } from "typeorm/browser";
@Entity('recent')
export class RecentModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    owner: string;

    @Column()
    videoId: string;

    @Column()
    durationText: string;

    @Column()
    durationNumber: number;

    @Column()
    thumbnail: string;
}