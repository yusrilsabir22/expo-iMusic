import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm/browser";
import { PlaylistModel } from "./playlist.model";

@Entity('song')
export class SongModel {
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

    @ManyToOne((type) => PlaylistModel, (playlistModel) => playlistModel.items)
    playlistMusic: PlaylistModel;
}