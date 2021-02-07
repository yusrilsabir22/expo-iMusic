import { FontAwesome5 } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import { View, Image, Text, FlatList, Animated, TouchableOpacity, TextInput, Easing, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useDatabaseConnection } from '../../database/connection'
import { PlaylistModel } from '../../database/entities/playlist.model'
import { RecentModel } from '../../database/entities/recent.model'
import { YoutubeReducerState } from '../../redux/reducers'
import { INIT_DB, SET_ACTIVE_PLAYLIST, SET_MUSIC_STATE, SET_PLAYER_SCREEN } from '../../redux/types'
import { MusicState, PlayerScreen, YoutubePlaylist } from '../../types'
import { colors } from '../../utils/color'
import { SCREEN_HEIGHT, SCREEN_WIDTH, SPACING } from '../../utils/screen'
import ItemSong from '../ItemSong'
import SmallModal from '../Modal'
import ModalAddPlaylist from '../ModalAddPlaylist'

export const LocalPlaylistTab: React.FC = (props) => {

    const state = useSelector((state: YoutubeReducerState) => state)
    const dispatch = useDispatch()
    const {recentRepo, playlistRepo, songRepo} = useDatabaseConnection()

    const [visible, setVisible] = useState(false);
    const rotateAnim = useRef(new Animated.Value(0)).current

    const [playlists, setPlaylists] = useState<PlaylistModel[]>();
    const [playlist, setPlaylist] = useState<PlaylistModel>(null);

    const [song, setSong] = useState<YoutubePlaylist>(null)
    const [name, setName] = useState('')
    const [compositeAnim, setCompositeAnim] = useState<Animated.CompositeAnimation>(null)

    const startRotate = () => {
        const cmp = Animated.loop(Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 8000,
            easing: Easing.linear,
            useNativeDriver: true
        }))
        setCompositeAnim(cmp)
        cmp.start()
    }

    const resetRotate = () => {
        compositeAnim && compositeAnim.reset()
    }

    const rotateStyle = {
        transform: [
            {
                rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                })
            }
        ]
    }

    const onCreatePlaylist = async (cardName: string) => {
        if(cardName !== '') {
            const pl = await playlistRepo.create(cardName)
            setPlaylists(prev => [...prev, pl])
            dispatch({
                type: INIT_DB,
                payload: {
                    playlistRepo,
                    songRepo
                }
            })
        }
    }

    const onCreateSong = async (playlist) => {
        if(song !== null && playlist !== null) {
            await songRepo.create({...song, playlistMusic: playlist})
            dispatch({
                type: INIT_DB,
                payload: {
                    playlistRepo,
                    songRepo
                }
            })
        }
    }

    return (
        <View style={{
            backgroundColor: colors.BLUE.PRIMARY,
            width: SCREEN_WIDTH,
            // height: SCREEN_HEIGHT * 0.8,
            marginBottom: SPACING
        }}>
            <FlatList
                data={state.recents}
                keyExtractor={(v, i) => v.videoId+i+"" }
                style={{marginBottom: SCREEN_HEIGHT * 0.06}}
                renderItem={({item}) => {
                    return (
                        <ItemSong
                            onLongPress={() => {
                                // setVisible(true)
                                setSong(item)
                            }}
                            onPress={() => {
                                dispatch({type: SET_ACTIVE_PLAYLIST, payload: {data: item, title: 'Recent'}});
                                dispatch({type: SET_MUSIC_STATE, payload: MusicState.new})
                                dispatch({type: SET_PLAYER_SCREEN, payload: PlayerScreen.full})
                                recentRepo.create(item)
                            }}
                            state={state}
                            item={item}
                        />
                    )
                }}
                ListEmptyComponent={() => {
                    return (
                        <View style={{flex: 1, height: SCREEN_HEIGHT * 0.7, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center'}}>No Recent History</Text>
                        </View>
                    )
                }}
            />
            <ModalAddPlaylist
                visible={false}
                onCreatePlaylist={(name) => {
                    onCreatePlaylist(name);
                }}
                onCreateSong={async (item) => {
                    await onCreateSong(item)
                }}
                playlists={playlists}
                setPlaylist={(playlists) => {
                    setPlaylist(playlists)
                }}
                setName={(name) => {
                    setName(name)
                }}
                close={() => {
                    // setVisible(false)
                }}
            />
        </View>
    )
}
