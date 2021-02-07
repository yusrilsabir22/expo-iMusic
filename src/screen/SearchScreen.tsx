import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, TextInput, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import { useDispatch, useSelector } from 'react-redux';
import BaseInput from '../component/BaseInput';
import BaseScreen from '../component/BaseScreen';
import Loading from '../component/loading';
import SmallModal from '../component/Modal';
import { useDatabaseConnection } from '../database/connection';
import { useSocketConnection, useSocketOnScroll } from '../config/socket-conn';
import { PlaylistModel } from '../database/entities/playlist.model';
import { YoutubeReducerState } from '../redux/reducers';
import { CLEAN_SEARCH, FETCH_SEARCH, INIT_DB, SET_ACTIVE_PLAYLIST, SET_LOADING, SET_MUSIC_STATE, SET_PLAYER_SCREEN, SET_REFRESHING, START_TOAST } from '../redux/types';
import {GlobalProps, MusicState, PlayerScreen, YoutubePlaylist} from '../types';
import { colors } from '../utils/color';
import { SCREEN_HEIGHT, SPACING } from '../utils/screen';

export const SearchScreen: React.FC<GlobalProps> = (props) => {

    const search = useSelector((state: YoutubeReducerState) => state.search)
    const loading = useSelector((state: YoutubeReducerState) => state.loading)
    const [visible, setVisible] = useState(false);
    const [locSearch, setLocSearch] = useState<YoutubePlaylist[]>([])
    const [playlists, setPlaylists] = useState<PlaylistModel[]>();
    const [song, setSong] = useState<YoutubePlaylist>(null)
    const [name, setName] = useState('');
    const [query, setQuery] = useState('')

    const flatlistRef = useRef<FlatList>(null)

    const {playlistRepo, songRepo, recentRepo, initialRepo} = useDatabaseConnection()

    const scroller = useSocketOnScroll()

    const conn = useSocketConnection()

    const onCreatePlaylist = async () => {
        if(name !== '') {
            const pl = await playlistRepo.create(name)
            setPlaylists(prev => [...prev, pl])
            dispatch({
                type: INIT_DB,
                payload: {
                    playlistRepo,
                    songRepo,
                    recentRepo,
                    initialRepo
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
                    songRepo,
                    recentRepo,
                    initialRepo
                }
            })
        }
    }


    const dispatch = useDispatch()

    useEffect(() => {
        if(scroller.length > 0 && !scroller[0].error) {
            setLocSearch(prev => scroller)
        }
    }, [scroller])

    useEffect(() => {
        setLocSearch(search)
        if(search.length > 0) {
            if(flatlistRef.current !== null) {
                flatlistRef.current.scrollToIndex({index: 0, animated: true})
            }
        }
    }, [search])

    useEffect(() => {
        playlistRepo && playlistRepo.getAll().then(val => setPlaylists(val)).catch(err => {})
        return () => {
            setLocSearch([]);
            dispatch({type: CLEAN_SEARCH})
            dispatch({type: SET_REFRESHING, payload: false})
        }
    }, [])


    return (
        <BaseScreen navigation={props.navigation}>
            <View style={{paddingTop: SPACING * 3}}>
            <SharedElement
                id="item.1.home-search"
            >
                <BaseInput
                    iconName={'search'}
                    iconColor={colors.BLACK.FONT}
                    iconSize={SPACING + 3}
                    placeholder={'Search music'}
                    onChangeText={(text) => setQuery(text)}
                    onSubmitEditing={() => {
                        if(query !== null) {
                            if(flatlistRef.current !== null && search.length > 0) {
                                flatlistRef.current.scrollToIndex({index: 0, animated: true})
                            }
                            dispatch({
                                type: SET_LOADING,
                                payload: true
                            });
                            dispatch({
                                type: FETCH_SEARCH,
                                payload: query
                            });
                        }
                    }}
                    loading={loading}
                    autoFocus
                    focusable
                />
            </SharedElement>
            <FlatList
                data={locSearch}
                keyExtractor={(v, i) => i.toString()}
                contentContainerStyle={{
                    marginBottom: SPACING * 8,
                    paddingBottom: SPACING * 8
                }}
                style={{
                    marginBottom: SPACING * 8,
                    paddingBottom: SPACING * 8
                }}

                onEndReached={() => {
                    console.log('on End reached')
                    if(locSearch.length > 0) {
                        conn.emit('scroll-down')
                    }
                }}

                ref={flatlistRef}

                onEndReachedThreshold={1}
                renderItem={({item}) => {
                    return (
                        <View style={{paddingHorizontal: SPACING * 2}}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onLongPress={() => {
                                    // setVisible(true)
                                    setSong(item)
                                    dispatch({
                                        type: START_TOAST,
                                        payload: {
                                            toast: true,
                                            toastData: item,
                                            toastMessage: 'test'
                                        }
                                    })
                                }}
                                onPress={async () => {
                                    dispatch({type: SET_ACTIVE_PLAYLIST, payload: {data: item, title: 'Search'}});
                                    dispatch({type: SET_MUSIC_STATE, payload: MusicState.new})
                                    dispatch({type: SET_PLAYER_SCREEN, payload: PlayerScreen.full})
                                    await recentRepo.create(item)
                                    dispatch({
                                        type: INIT_DB,
                                        payload: {
                                            playlistRepo,
                                            songRepo,
                                            recentRepo,
                                            initialRepo
                                        }
                                    })
                                }}
                            >
                                <View style={{marginTop: 0, padding: SPACING}}>
                                    <Text style={{color: colors.BLACK.FONT, marginLeft: SPACING, marginBottom: SPACING, fontSize: 12}}>{item.owner}</Text>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <View style={{backgroundColor: colors.WHITE.BG, padding: SPACING - 5, flexDirection: 'row', alignItems: 'center', borderRadius: 29, width: '90%'}}>
                                            <Image
                                                source={{uri: item.thumbnail}}
                                                style={{width: 36, height: 36, resizeMode: 'cover', borderRadius: 18, left: -14}}
                                            />
                                            <Text style={{color: 'white', fontSize: 12, maxWidth: 230}}>{item.title}</Text>
                                        </View>
                                        <Text style={{color: colors.BLACK.FONT, width: '10%', marginHorizontal: 10, fontSize: 12}}>{item.durationText}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                }}

                ListEmptyComponent={() => {
                    // if(!!loading) {
                    //     return <View style={{flex: 1, height: SCREEN_HEIGHT * 0.4, justifyContent: 'center',alignItems: 'center'}}>
                    //         <Loading/>
                    //     </View>
                    // }
                    return (
                        <View style={{flex: 1, height: SCREEN_HEIGHT * 0.3,justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#fff'}}>No Item</Text>
                        </View>
                    )
                }}

                ListFooterComponent={() => {
                    return search ? (search.length > 0) && <ActivityIndicator animating color={colors.BLUE.SOFT} size={44} /> : <Text></Text>
                }}
            />
            </View>
        </BaseScreen>
    );
};

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
