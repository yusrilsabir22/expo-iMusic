import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm/browser";
import { SongModel } from "./song.model";

@Entity('playlistmusic')
export class PlaylistModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cardTitle: string;

    @OneToMany((type) => SongModel, (songModel) => songModel.playlistMusic)
    @JoinColumn()
    items: SongModel[];

}