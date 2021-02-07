import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, Text,  StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator, TextInput, Animated, Easing } from 'react-native'
import {FontAwesome5} from '@expo/vector-icons';
import { SharedElement } from 'react-navigation-shared-element';
import {} from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlaylist } from '../redux/action';
import { YoutubeReducerState } from '../redux/reducers';
import { INIT_DB, SAVE_PLAYLIST, SET_ACTIVE_PLAYLIST, SET_LOADING, SET_MUSIC_STATE, SET_PLAYER_SCREEN, SET_REFRESHING, START_TOAST } from '../redux/types';
import { GlobalProps, MusicState, PlayerScreen, YoutubePlaylist } from '../types'
import { colors } from '../utils/color';
import { SCREEN_HEIGHT, SCREEN_WIDTH, SPACING } from '../utils/screen';
import { useDatabaseConnection } from '../database/connection';
import ItemSong from '../component/ItemSong';
import BaseScreen from '../component/BaseScreen';

const Headers = ({navParams, indexCard}) => {
    return (
        <React.Fragment>
            <SharedElement id={`item.${navParams?.playlistId}-${indexCard}.photo`} style={{...StyleSheet.absoluteFillObject}}>
                <Image
                    source={{
                        uri: navParams?.thumbnail || 'https://www.zanderjaz.com/wp-content/themes/zanderjaz/img/wallpapers/1920x1080/black-and-white-1284026.jpg'
                    }}
                    resizeMode="cover"
                    style={styles.container}
                />
            </SharedElement>
            <SharedElement id={`item.${navParams?.playlistId}-${indexCard}.overlay`} style={{...StyleSheet.absoluteFillObject}}>
                <View style={[StyleSheet.absoluteFill, {
                    backgroundColor: '#000',
                    opacity: 0.7,
                    zIndex: 3,
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                }]} />
            </SharedElement>
        </React.Fragment>
    )
}


export const PlaylistScreen: React.FC<GlobalProps> = (props) => {
    const state  = useSelector((state: YoutubeReducerState) => state);
    const [locPlay, setLocPlay] = useState<YoutubePlaylist[]>([])
    const dispatch = useDispatch();
    const [itemHeights, setItemHeights] = useState([])
    const {playlistRepo, songRepo, recentRepo, initialRepo} = useDatabaseConnection();

    const onSwipeAction = async (videoId, type, item) => {
        if(type === "create") {
            dispatch({
                type: START_TOAST,
                payload: {
                    toast: true,
                    toastData: item,
                    toastMessage: 'swipe '+type
                }
            })
        }

        if(type === "delete") {
            await songRepo.delete(videoId)
            dispatch({
                type: INIT_DB,
                payload: {
                    playlistRepo,
                    songRepo,
                    recentRepo,
                    initialRepo
                }
            })

            const idx = state.playlist.indexOf(item);
            if(idx >= 0) {
                const newPlaylist = state.playlist.splice(idx, 1);
                dispatch({
                    type: SAVE_PLAYLIST,
                    payload: {data: newPlaylist}
                })
                if(idx === 0) {
                    props.navigation.goBack()
                }
            }
        }
    }


    const route = useRoute()
    // @ts-ignore
    const navParams = route.params.data
    // @ts-ignore
    const indexCard = route.params?.indexCard

    useEffect(() => {
        setLocPlay(state.playlist)
    }, [state.playlist])

    useEffect(() => {
        if(navParams?.from === 'home') {
            dispatch(fetchPlaylist(navParams?.playlistId));
        }

        return () => {
            dispatch({type: SET_REFRESHING, payload: false})
            dispatch({type: SET_LOADING, payload: false})
        }
    }, ['']);

    return (
        <BaseScreen navigation={props.navigation} header={<Headers navParams={navParams} indexCard={indexCard} />}>

            <View style={{ maxHeight: SCREEN_HEIGHT * 0.87}}>
                <View style={[styles.headerContainer, {zIndex: 70}]}>
                    <TouchableOpacity style={{alignSelf: 'center'}} onPress={() => {props.navigation.goBack()}}>
                        <FontAwesome5 name="arrow-left" size={20} color={colors.BLUE.ICON} />
                    </TouchableOpacity>
                    <SharedElement id={`item.${navParams?.playlistId}-${indexCard}.text`}>
                        <Text style={styles.headerTxt}>{navParams?.title}</Text>
                    </SharedElement>
                    <TouchableOpacity style={[styles.button]}>
                        <FontAwesome5 name="ellipsis-h" size={12} color={colors.BLUE.ICON} />
                    </TouchableOpacity>
                </View>
                {
                    state.loading ?
                    <View style={{flex: 1, marginTop: SCREEN_HEIGHT * 0.5 - 70,justifyContent: 'center', alignContent: 'center'}}>
                        <ActivityIndicator animating color={colors.BLUE.SOFT} size={"large"} />
                    </View>
                    :
                    <View style={styles.contentContainer}>
                        <FlatList
                            data={locPlay}
                            keyExtractor={(v, i) => v.videoId+i+"" }
                            style={{marginBottom: SCREEN_HEIGHT * 0.06}}
                            renderItem={({item, index}) => {
                                return (
                                    <ItemSong
                                        state={state}
                                        type={navParams.from}
                                        onSwipeAction={(videoId, type) => onSwipeAction(videoId, type, item)}
                                        onLongPress={() => {
                                            // setVisible(true)
                                            // setSong(item)
                                            dispatch({
                                                type: START_TOAST,
                                                payload: {
                                                    toast: true,
                                                    toastData: item,
                                                    toastMessage: 'test'
                                                }
                                            })
                                        }}
                                        item={item}
                                        onPress={async () => {
                                            if(state.musicState === MusicState.new) {
                                                return
                                            }
                                            if(item.videoId === state.active?.videoId) {
                                                dispatch({type: SET_MUSIC_STATE, payload: MusicState.open})
                                                return
                                            }
                                            dispatch({type: SET_ACTIVE_PLAYLIST, payload: {data: item, title: navParams?.title}});
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

                                        onLayout={(h) => setItemHeights(prev => [...prev, h])}
                                    />
                                )
                            }}
                            ListEmptyComponent={() => {
                                return(
                                    <View style={{flex: 1}}>
                                        <Text style={{color: '#fff', fontSize: 22, textAlign: 'center', fontWeight: 'bold'}}>No song was save</Text>
                                    </View>
                                )
                            }}

                            maxToRenderPerBatch={5}
                            initialNumToRender={10}
                            updateCellsBatchingPeriod={30}
                            onEndReachedThreshold={0.3}
                            removeClippedSubviews={false}
                            windowSize={5}
                            legacyImplementation={false}
                            getItemLayout={(data, index) => {

                                const length = itemHeights[index] || 0;
                                const offset = itemHeights.slice(0,index).reduce((a, c) => a + c, 0)

                                return {length, offset, index}
                            }}
                        />
                    </View>

                }
            </View>
        </BaseScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        resizeMode: 'cover',
        // padding: SPACING,
        position: 'absolute',
        zIndex: 0
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING + 20,
        marginHorizontal: SPACING * 2,
    },
    headerTxt: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',
        maxWidth: 270,
        textAlign: 'center',
    },
    button: {
        borderColor: colors.BLUE.ICON,
        borderWidth: 1,
        borderRadius: 140,
        alignSelf: 'center',
        padding: 5,
    },
    contentContainer: {
        marginTop: SPACING * 2,
        marginHorizontal: SPACING,
    },
    musicPlayer: {
        backgroundColor: colors.BLACK.PRIMARY,
        paddingHorizontal: SPACING * 2,
        paddingVertical: SPACING,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    musicPlayerImg: {
        resizeMode: 'cover',
        width: 35,
        height: 35,
        borderRadius: 17.5,
    },
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
});
