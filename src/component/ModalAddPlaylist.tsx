import { FontAwesome5 } from '@expo/vector-icons'
import React from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { PlaylistModel } from '../database/entities/playlist.model'
import { SongModel } from '../database/entities/song.model'
import { colors } from '../utils/color'
import { SCREEN_HEIGHT, SPACING } from '../utils/screen'
import SmallModal from './Modal'

type Props = {
    visible: boolean;
    close: () => void;
    setPlaylist: (item: any) => void;
    onCreateSong: (item: PlaylistModel) => void;
    onCreatePlaylist: (name: string) => void;
    playlists: PlaylistModel[],
    setName: (name: string) => void;
}

const ModalAddPlaylist: React.FC<Props> = ({
    visible,
    close,
    setPlaylist,
    onCreateSong,
    playlists,
    onCreatePlaylist
}) => {

    const [name, setName] = React.useState('')

    return (
        <SmallModal visible={visible} onRequestClose={() => {close()}}>
                <View style={[styles.modalView, {position: 'absolute', top: SCREEN_HEIGHT * .2, left: 20, right: 20, bottom: SCREEN_HEIGHT * .2, justifyContent: 'center', alignItems: 'center'}]}>
                    <TouchableOpacity style={{position: 'absolute', top: -10, right: -10, backgroundColor: colors.BLUE.SOFT, padding: SPACING, opacity: 1, borderRadius: 60}} onPress={() => close()}>
                        <View>
                            <FontAwesome5 name="times" size={22} color={'#fff'} />
                        </View>
                    </TouchableOpacity>
                    <View style={{flex: 1, width: '100%'}}>
                        <TextInput 
                            placeholder={"Playlist's name"} 
                            style={{
                                backgroundColor: colors.BLUE.SOFT,
                                opacity: 1,
                                width: '100%',
                                color: '#fff',
                                borderRadius: 10,
                                padding: SPACING - 5
                            }}
                            onChangeText={(text) => setName(text)}
                        />
                        <TouchableOpacity onPress={() => onCreatePlaylist(name)} style={{backgroundColor: colors.BLUE.SOFT, marginTop: 20, borderRadius: 10, padding: SPACING}}>
                            <Text style={{textAlign: 'center', color: colors.BLUE.DARK}}>Add Playlist</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: '100%', height: 1, marginBottom: 20, marginTop: 50, backgroundColor: colors.BLUE.ICON}} />
                    <Text style={{color: colors.BLUE.SOFT, marginBottom: 10}}>Current Playlist</Text>
                    <FlatList
                        data={playlists}
                        keyExtractor={(v, index) => v.id+''}
                        horizontal
                        contentContainerStyle={{marginHorizontal: 10}}
                        style={{
                            height: 'auto'
                        }}
                        renderItem={({item}) => {
                            return (
                                <TouchableOpacity
                                    onPress={async () => {
                                        setPlaylist(item)
                                        onCreateSong(item);
                                        close()
                                    }}
                                >
                                    <View style={{marginHorizontal: 10, padding: SPACING, width: 100, height: 100, backgroundColor: colors.BLUE.SOFT}}>
                                        <Text>{item.cardTitle}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                        ListEmptyComponent={() => {
                            return <View style={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
                                    <Text>No Playlist</Text>
                                </View>
                        }}
                    />
                </View>
            </SmallModal>
    )
}

export default ModalAddPlaylist;


const styles = StyleSheet.create({
     modalView: {
        margin: 20,
        backgroundColor: colors.BLUE.DARK,
        // opacity: 1,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})

