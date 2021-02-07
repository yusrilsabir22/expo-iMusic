import React, { useEffect, useRef, useState } from 'react'
import { FlatList, TextInput, TouchableOpacity, View, Text, Animated, TouchableWithoutFeedback } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useDatabaseConnection } from '../database/connection'
import { PlaylistModel } from '../database/entities/playlist.model'
import { SongModel } from '../database/entities/song.model'
import { YoutubeReducerState } from '../redux/reducers'
import { INIT_DB, RESET_TOAST } from '../redux/types'
import { YoutubePlaylist } from '../types'
import { colors, LIST_COLOR_MATERIAL } from '../utils/color'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/screen'
import BottomSheetItem from './BottomSheetItem'

const BottomSheet = () => {

    const inputRef = useRef<TextInput>(null)
    const anim1 = useRef(new Animated.Value(0)).current
    const anim2 = useRef(new Animated.Value(0)).current
    const state = useSelector((state: YoutubeReducerState) => state)
    const [playlists, setPlaylists] = useState([])
    const [addNew, setAddNew] = useState(false);
    const [value, setValue] = useState('')
    const dispatch = useDispatch()

    const animatedStyle = {
        opacity: anim2.interpolate({
            inputRange: [0, 50, 100],
            outputRange: [0, 0.5, 1],
            extrapolate: 'clamp'
        }),
    }

    const {playlistRepo, songRepo, recentRepo, initialRepo} = useDatabaseConnection();

    const onCreatePlaylist = async () => {
        if(value !== '') {
            await playlistRepo.create(value)
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

    const onCreateSong = async (playlist: PlaylistModel) => {
        if(state.toastData !== null && playlist !== null) {
            await songRepo.create({...state.toastData, playlistMusic: playlist})
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

    const onPress = async (item: PlaylistModel) => {
        await onCreateSong(item);
        close();
        (inputRef.current !== null) && inputRef.current.clear();
        setAddNew(false)
        dispatch({
            type: RESET_TOAST
        })
    }

    const filterPlaylists = () => {
        if(state.toastData !== null) {
            const pl: PlaylistModel[] = []
            Array.from(state.myPlaylist).map((val, index) => {
                var is = false;
                const items: SongModel[] = []
                Array.from(val.items).map((v, i) => {
                    is = v.videoId === state.toastData.videoId ? true : is
                    items.push(v);
                })
                if(!is) {
                    pl.push(val)
                }
                return
            })
            // console.log('bottom',pl)
            setPlaylists(pl)
            return pl;
        } else {
            setPlaylists(state.myPlaylist)
        }
    }

    const open = () => {
        Animated.timing(anim2, {
            toValue: 100,
            duration: 100,
            useNativeDriver: true
        }).start(() => {
            Animated.timing(anim1, {
                toValue: 100,
                duration: 100,
                useNativeDriver: true
            }).start()
        })
    }

    const openAnim1 = () => {
        Animated.timing(anim1, {
            toValue: 100,
            duration: 300,
            useNativeDriver: true
        }).start()
    }

    const closeAnim1 = () => {
        Animated.timing(anim1, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start()
    }

    const close = () => {
        Animated.timing(anim1, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true
        }).start(() => {
            Animated.timing(anim2, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true
            }).start()
        })
    }

    useEffect(() => {
        if(state.toast) {
            open();
        } else {
            close()
            setAddNew(false)
        }
    }, [state.toast])

    useEffect(() => {
        filterPlaylists()
    }, [state.toastData, state.myPlaylist])

    return (
        <Animated.View
            pointerEvents={state.toast ? "box-none" : "none"}
            style={[
                animatedStyle,
                {
                    padding: 20,
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 130,
                    paddingHorizontal: 20,
                    backgroundColor: 'transparent'
                }
            ]}
            >
            <TouchableWithoutFeedback
                style={{zIndex: 1}}
                onPress={() => {
                    inputRef.current !== null && inputRef.current.clear();
                    dispatch({
                        type: RESET_TOAST
                    });
                }}
                >
                    <Animated.View
                         style={{
                            position: 'absolute',
                            backgroundColor: 'rgba(1, 1, 1, .8)',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            zIndex: 131,
                            opacity: anim2.interpolate({
                                inputRange: [0, 20, 100],
                                outputRange: [0, .5, 1],
                                extrapolate: 'clamp'
                            })
                        }}
                    />
            </TouchableWithoutFeedback>
            <Animated.View
                style={{
                    zIndex: 132,
                    backgroundColor: colors.MATERIAL.LIGHT.CYAN,
                    // opacity: .8,
                    position: 'absolute',
                    bottom: 30,
                    left: 0,
                    right: 0,
                    marginHorizontal: 20,
                    paddingVertical: 20,
                    borderRadius: 20,
                    transform: [
                        {
                            translateY: anim1.interpolate({
                                inputRange: [0, 100],
                                outputRange: [SCREEN_HEIGHT, 0]
                            })
                        }
                    ]
                }}
            >
                <Text style={{fontSize: 15, textAlign: 'center', color: '#fff', marginBottom: 20}}>{addNew ? 'ADD NEW PLAYLIST' : 'ADD TO PLAYLIST'}</Text>
                {!addNew ?
                    <FlatList
                        data={playlists.reverse()}
                        extraData={playlists}
                        scrollsToTop
                        centerContent
                        horizontal
                        initialNumToRender={2}
                        keyExtractor={(v, i) => i+""}
                        contentContainerStyle={{
                            padding: 10,
                            marginHorizontal: 10,
                            alignItems: 'center'
                        }}
                        style={{
                            marginHorizontal: 20,
                        }}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item, index}) => {
                            return (
                                <BottomSheetItem index={index} item={item} onPress={() => onPress(item)} />
                            )
                        }}
                    /> : <View style={{padding: 15, paddingHorizontal: 20,justifyContent: 'center', alignItems: 'center'}}>
                            <TextInput
                                placeholder="playlist name"
                                style={{
                                    backgroundColor: '#fff',
                                    padding: 10,
                                    width: '100%',
                                    color: '#000',
                                    borderRadius: 10,
                                    marginBottom: 15
                                }}
                                onChangeText={(text) => setValue(text)}
                                ref={inputRef}
                            />
                            <TouchableOpacity style={{padding: 10}} onPress={() => {
                                if(value !== '') {
                                    Animated.timing(anim1, {
                                        toValue: 0,
                                        duration: 50,
                                        useNativeDriver: true
                                    }).start(() => {
                                        onCreatePlaylist();
                                        (inputRef.current !== null) && inputRef.current.clear();
                                        setAddNew(false)
                                        Animated.timing(anim1, {
                                            toValue: 100,
                                            duration: 50,
                                            useNativeDriver: true
                                        }).start()
                                    });
                                }
                            }}>
                                <Text style={{fontSize: 16, color: '#fff'}}>ADD</Text>
                            </TouchableOpacity>
                        </View>
                }
                <TouchableOpacity
                    onPress={() => {
                        Animated.timing(anim1, {
                            toValue: 0,
                            duration: 50,
                            useNativeDriver: true
                        }).start(() => {
                            setAddNew((prev) => !prev);
                            (inputRef.current !== null) && inputRef.current.clear();
                            Animated.timing(anim1, {
                                toValue: 100,
                                duration: 50,
                                useNativeDriver: true
                            }).start()
                        })
                    }}
                    activeOpacity={0.5}
                    style={{marginHorizontal: 10,padding: 20, borderTopColor: 'rgba(255, 255, 255, .1)', borderTopWidth: 0.7, borderBottomColor: 'rgba(255, 255, 255, .1)', borderBottomWidth: 0.7}}>
                    <Text style={{fontSize: 15, color: !addNew ? '#fff' : 'red', textAlign: 'center'}}>{!addNew ? 'ADD NEW PLAYLIST' : 'CANCEL'}</Text>
                </TouchableOpacity>
                {
                    !addNew ?
                    <TouchableOpacity
                        onPress={() => {
                            close()
                            dispatch({
                                type: RESET_TOAST
                            });

                            inputRef.current !== null && inputRef.current.clear();
                            setAddNew(false)
                        }}
                        activeOpacity={0.5}
                        style={{marginHorizontal: 10,padding: 20, borderTopColor: 'rgba(1, 1, 1, .1)', borderTopWidth: 0.7, borderBottomColor: 'rgba(1, 1, 1, .1)', borderBottomWidth: 0.7}}>
                        <Text style={{fontSize: 15, color: 'red', textAlign: 'center'}}>{'CANCEL'}</Text>
                    </TouchableOpacity> : null
                }
            </Animated.View>
        </Animated.View>
    )
}


export default BottomSheet
