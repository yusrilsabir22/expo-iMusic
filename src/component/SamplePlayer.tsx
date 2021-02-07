import React, { useCallback, useEffect, useRef, useState } from 'react'
import Slider from '@react-native-community/slider';
import { Text, View, PanResponder, StatusBar, Image, StyleSheet, TouchableOpacity, PanResponderInstance, Animated, TouchableHighlight, ScrollView } from 'react-native'
import {FontAwesome5} from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { YoutubeReducerState } from '../redux/reducers';
import { colors } from '../utils/color';
import { SCREEN_HEIGHT, SCREEN_WIDTH, SPACING } from '../utils/screen'
import { dateSecToString } from '../utils/time';
import { MusicState, PlayerScreen } from '../types';
import { INIT_DB, SET_ACTIVE_PLAYLIST, SET_MUSIC_STATE, SET_PLAYER_SCREEN, START_TOAST } from '../redux/types';
import { Audio } from 'expo-av';
import { music_URL } from '../utils/constants';
import { useTrackPlayerStatus } from '../config/PlayerService';
import { useDatabaseConnection } from '../database/connection';
import { Easing } from 'react-native-reanimated';
const SamplePlayer = (props) => {

    const dispatch = useDispatch();
    const active = useSelector((state: YoutubeReducerState) => state.active);
    const state = useSelector((state: YoutubeReducerState) => state)
    const [index, setIndex] = useState(0);
    const [sMusic, setMusic] = React.useState<Audio.Sound>(null)
    const [isPrev, setIsPrev] = useState(false);

    const [isNext, setIsNext] = useState(false)

    // const playlistTitle = useSelector((state: YoutubeReducerState) => state.playlistTitle)
    const {recentRepo, initialRepo, playlistRepo, songRepo} = useDatabaseConnection()
    const _animation = useRef(new Animated.Value(0)).current
    // @ts-ignore
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([
                        null,
                        {
                            dy: _animation
                        },
                ], { useNativeDriver: false }),
            // {
            //     console.log(`dy: ${gesture.dy}, moveY: ${gesture.moveY}, vy: ${gesture.vy}, y0: ${gesture.y0}`);
            //     const anim = gesture.dy - e.nativeEvent.pageY;
            //     gesture.dy = anim;
            // },
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dy > 110) {
                    Animated.timing(_animation, {
                        toValue: 300,
                        duration: animDuration,
                        useNativeDriver: true,
                        easing: Easing.linear
                    }).start();
                _animation.setOffset(300);
                } else {
                    Animated.timing(_animation, {
                        toValue: 0,
                        duration: animDuration,
                        useNativeDriver: true,
                        easing: Easing.linear
                    }).start();
                    _animation.setOffset(0);
                }
            }
        })
    ).current;
    const videoHeight = SCREEN_HEIGHT * 0.75;


    const padding = 15;
    const statusBarHeight = StatusBar.currentHeight || 0;
    const yOutput = ((SCREEN_HEIGHT - videoHeight) + (( videoHeight * .5) / 2)) - padding - statusBarHeight;
    const animDuration = 800;
    const xOutput = 0;
    const [isClicked, setIsClicked] = useState(false);
    const musicState = useSelector((state: YoutubeReducerState) => state.musicState)

    const handleOpen = (dur?: number) => {
        Animated.timing(_animation, {
            toValue: 0,
            duration: dur ? dur : animDuration,
            useNativeDriver: true
        }).start();
        _animation.setOffset(0);
        dispatch({
            type: SET_MUSIC_STATE,
            payload: MusicState.none
        });
    }

    const handleClose = () => {
        // _animation.setOffset(300);
        Animated.timing(_animation, {
            toValue: 300,
            duration: animDuration,
            useNativeDriver: true
        }).start();
    }

    const opacityInterpolate = _animation.interpolate({
      inputRange: [0, 100, 300],
      outputRange: [1,0.2, 0],
    });

    const translateYInterpolate = _animation.interpolate({
      inputRange: [0, 300],
      outputRange: [0, SCREEN_HEIGHT - 90],
      extrapolate: "clamp",
    });

    const scaleInterpolate = _animation.interpolate({
      inputRange: [0, 300],
      outputRange: [1, 0.5],
      extrapolate: "clamp",
    });

    const translateXInterpolate = _animation.interpolate({
      inputRange: [0, 300],
      outputRange: [0, xOutput],
      extrapolate: "clamp",
    });

    const translateXMiniInterpolate = _animation.interpolate({
        inputRange: [0, 150, 300],
        outputRange: [-10, -5, 0],
        extrapolate: "clamp",
    })

    const translateYMiniInterpolate = _animation.interpolate({
        inputRange: [0, 300],
        outputRange: [250, 0],
        extrapolate: "clamp",
    })

    const miniStyles = {
        opacity: _animation.interpolate({
            inputRange: [0, 300],
            outputRange: [0, 1],
            extrapolate: "clamp",
        }),
        transform: [
            {
                translateY: translateYMiniInterpolate
            },
            {
                translateX: translateXMiniInterpolate
            }
        ]
    }

    const scrollStyles = {
      opacity: opacityInterpolate,
      transform: [
        {
          translateY: translateYInterpolate,
        },
      ],
    };

    const imageStyle = {
        opacity: opacityInterpolate,
        transform: [
            {
                translateY:  _animation.interpolate({inputRange: [0, 300], outputRange: [0, SCREEN_HEIGHT], extrapolate: 'clamp'})
            }
        ]
    }

    const videoStyles = {
      transform: [
        {
          translateY: translateYInterpolate,
        },
        {
          translateX: translateXInterpolate,
        },
      ],
    };

    const {isPlay, loaded, finish, position} = useTrackPlayerStatus(sMusic)
    const pause = async () => {
        if(sMusic !== null) {
            await sMusic.pauseAsync()
        }
    }


    const resume = async () => {
        if(sMusic !== null || sMusic === undefined) {
            if(loaded && !finish) {
                await sMusic.playAsync();
                setIsClicked(false)
            } else if(finish) {
                try {
                    await sMusic.replayAsync({positionMillis: 0, shouldPlay: true, progressUpdateIntervalMillis: 1000})
                    setIsClicked(false)
                } catch (error) {
                    await initPlay()
                }
            }
        } else {
            initPlay()
        }
    }

    const next = async () => {
        if(!isNext && !isClicked) {
            if(index >= 0 && state.playlist.length > 0 && index < state.playlist.length) {
                dispatch({type: SET_ACTIVE_PLAYLIST, payload: {data: state.playlist[index+1], title: 'Now Playing'}});
                dispatch({type: SET_MUSIC_STATE, payload: MusicState.new})
                dispatch({type: SET_PLAYER_SCREEN, payload: PlayerScreen.full})
                saveRepo()
            }

            if(index >= 0 && state.playlist.length > 0 && (index+1) === (state.playlist.length+1)) {
                setIndex(0)
                dispatch({type: SET_ACTIVE_PLAYLIST, payload: {data: state.playlist[0], title: 'Now Playing'}});
                dispatch({type: SET_MUSIC_STATE, payload: MusicState.new})
                dispatch({type: SET_PLAYER_SCREEN, payload: PlayerScreen.full})
                saveRepo()
            }
        }
    }

    const prev = async () => {
        if(!isPrev && !isClicked) {
            if(index > 0 && state.playlist.length > 0) {
                dispatch({type: SET_ACTIVE_PLAYLIST, payload: {data: state.playlist[index-1], title: 'Now Playing'}});
                dispatch({type: SET_MUSIC_STATE, payload: MusicState.new})
                dispatch({type: SET_PLAYER_SCREEN, payload: PlayerScreen.full})
                saveRepo()
            }

            if(index === 0 && state.playlist.length) {
                setIndex(0)
                dispatch({type: SET_ACTIVE_PLAYLIST, payload: {data: state.playlist[state.playlist.length - 1], title: 'Now Playing'}});
                dispatch({type: SET_MUSIC_STATE, payload: MusicState.new})
                dispatch({type: SET_PLAYER_SCREEN, payload: PlayerScreen.full})
                saveRepo()
            }
        }
    }

    const initPlay = async () => {
        try {
            await sMusic.unloadAsync();
            const {sound} = await Audio.Sound.createAsync({uri: music_URL+'play?uc='+active.videoId})
            setMusic(sound)
            sound.setProgressUpdateIntervalAsync(1000)
            await sound.playAsync();
            dispatch({type: SET_MUSIC_STATE, payload: MusicState.none})
            setIsClicked(false)
            setIsPrev(false)
            setIsNext(false)
        } catch (error) {
            play()
        }
    }


    const play = async (dur?: number) => {
        handleOpen(dur);
        try {
            if(sMusic === null) {
                const {sound} = await Audio.Sound.createAsync({uri: music_URL+'play?uc='+active.videoId})
                setMusic(sound)
                sound.setProgressUpdateIntervalAsync(1000)
                await sound.playAsync()
                dispatch({type: SET_MUSIC_STATE, payload: MusicState.none})
                setIsClicked(false)
                setIsPrev(false)
                setIsNext(false)
                return
            } else {
                await initPlay()
                return
            }
        } catch (error) {
            initPlay()
        }
    }

    // slider Listener
    const onSlidingComplete = (value: number) => {
        const time = dateSecToString(value)
    }

    const saveRepo = useCallback(async () => {
        await recentRepo.create(state.playlist[index+1])
        dispatch({
            type: INIT_DB,
            payload: {
                playlistRepo,
                songRepo,
                recentRepo,
                initialRepo
            }
        })
    }, [])

    useEffect(() => {
        Audio.setAudioModeAsync({
            staysActiveInBackground: true,
        });
        if(!active) {
            recentRepo.getAll().then((val) => {
                if(val.length > 0) {
                    dispatch({type: SET_ACTIVE_PLAYLIST, payload: {data: val[val.length - 1]}})
                }
            }).catch(err => {})
        }

        _animation.setValue(300);

        return () => {
            _animation.removeAllListeners();
            sMusic ? sMusic.unloadAsync() : null;
        }
    }, [''])

    useEffect(() => {
        const idx = state.playlist.indexOf(state.active);
        idx >= 0 && setIndex(idx);
    },[state.active])

    useEffect(() => {
        musicState === MusicState.new && play(100);
        musicState === MusicState.open && handleOpen(100);
    }, [musicState]);

    useEffect(() => {
        if(!isPrev && !isNext && !isClicked) {
            if(finish && state.playlist.length > 0 && (index+1) < state.playlist.length) {
                dispatch({type: SET_ACTIVE_PLAYLIST, payload: {data: state.playlist[index+1], title: 'Now Playing'}});
                dispatch({type: SET_MUSIC_STATE, payload: MusicState.new})
                dispatch({type: SET_PLAYER_SCREEN, payload: PlayerScreen.full})
                saveRepo()
            }

            if(finish && state.playlist.length > 0 && (index+1) === (state.playlist.length)) {
                setIndex(0)
                dispatch({type: SET_ACTIVE_PLAYLIST, payload: {data: state.playlist[0], title: 'Now Playing'}});
                dispatch({type: SET_MUSIC_STATE, payload: MusicState.new})
                dispatch({type: SET_PLAYER_SCREEN, payload: PlayerScreen.full})
                saveRepo()
            }
        }
    }, [finish])

    return (
        <Animated.View 
            style={[StyleSheet.absoluteFill, props.animStyle]}
            pointerEvents="box-none"
        >
          <Animated.View
            style={[
                {
                    width: SCREEN_WIDTH,
                    height: videoHeight,
                },
                videoStyles]}
            {...panResponder.panHandlers}
          >
            <Animated.Image source={{uri: active ? active.thumbnail! : 'https://f4.bcbits.com/img/0016073391_10.jpg'}} resizeMode="cover" style={[imageStyle, {width: SCREEN_WIDTH, height: SCREEN_HEIGHT, position: 'absolute', top: 0, right: 0, left: 0, bottom: 0}]} />
            <Animated.View style={[StyleSheet.absoluteFill, imageStyle, {top: 0, left: 0, right: 0, bottom: 0, height: SCREEN_HEIGHT,backgroundColor: '#000', opacity: 0.7}]} />
            {/* Mini Player */}
            <Animated.View
                style={[StyleSheet.absoluteFill, miniStyles, {backgroundColor: 'rgba(1, 1, 1, 0.7)'}]}
            >
                <View style={styles.musicPlayer}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                            style={[styles.musicPlayerImg]}
                            source={{
                                uri: active ? active.thumbnail : 'https://f4.bcbits.com/img/0016073391_10.jpg',
                            }}
                        />
                        <View style={{marginHorizontal: SPACING}}>
                            <Text
                                style={{
                                    margin: 0,
                                    padding: 0,
                                    fontSize: 13,
                                    color: colors.WHITE.LIGHT,
                                    opacity: 0.55,
                                }}>{active?.owner.substring(0, 30) || "Aaron Smith"}</Text>
                            <Text
                                style={{
                                    margin: 0,
                                    padding: 0,
                                    fontSize: 16,
                                    color: colors.WHITE.LIGHT,
                                }}>{active?.title.substring(0, 30) || 'Dancing'}</Text>
                        </View>
                    </View>
                    <TouchableHighlight
                        disabled={isClicked && !loaded}
                        onPress={() => {
                            setIsClicked(true)
                            if(isPlay == undefined) {
                                play()
                            } else {
                                if(isPlay) {
                                    pause()
                                } else {
                                    resume()
                                }
                            }
                        }}
                    >
                        <View style={{padding: 10}}>
                            <FontAwesome5 name={isPlay ? "pause" : "play"} size={20} color={colors.WHITE.LIGHT} />
                        </View>
                    </TouchableHighlight>
                </View>
            </Animated.View>
            <Animated.View style={[scrollStyles, styles.headerContainer]}>
                <TouchableOpacity style={{alignSelf: 'center', padding: 10}} onPress={() => {handleClose()}}>
                    <FontAwesome5 name="chevron-down" size={20} color={colors.BLUE.ICON} />
                </TouchableOpacity>
                <Text style={styles.headerTxt}>{'Now Playing'}</Text>
                <TouchableOpacity style={styles.button} onPress={() => {
                    dispatch({
                        type: START_TOAST,
                        payload: {
                            toast: true,
                            toastData: active,
                            toastMessage: 'test'
                        }
                    })
                }}>
                    <FontAwesome5 name="ellipsis-h" size={12} color={colors.BLUE.ICON} />
                </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[scrollStyles, {height: SCREEN_HEIGHT * 0.7, padding: SPACING * 4}]} >
                    <View style={{height: '100%', padding: SPACING, borderRadius: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Image
                            source={{
                                uri: active ? active.thumbnail : 'https://f4.bcbits.com/img/0016073391_10.jpg'
                            }}

                            resizeMode="cover"

                            style={{
                                width: SCREEN_WIDTH * 0.5,
                                height: SCREEN_HEIGHT * 0.3,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: 24,
                                transform: [
                                    {
                                        translateY: SPACING * 4
                                    }
                                ]
                            }}
                        />
                        <View style={{marginTop: SPACING * 4}}>
                            <Text style={{fontSize: 15, textAlign: 'center', letterSpacing: 1, color: 'white', marginBottom: SPACING}}>{active?.owner! || 'Aaron Smith'}</Text>
                            <Text style={{fontSize: 23, textAlign: 'center', letterSpacing: 1, color: 'white', fontWeight: 'bold'}}>{active?.title! || 'Dancing On My Own'}</Text>
                        </View>
                    </View>
            </Animated.View>
          </Animated.View>
            <Animated.View style={[scrollStyles, {display: 'flex', justifyContent: 'space-between', flex: 1, backgroundColor: 'transparent', padding: SPACING}]}>
                <View
                        style={styles.seekBarContainer}
                    >
                        <Text style={{color: '#FFF'}}>{dateSecToString(position || 0)}</Text>
                        <Slider
                            maximumValue={active?.durationNumber || 0}
                            minimumValue={0}
                            thumbTintColor={colors.WHITE.LIGHT}
                            minimumTrackTintColor={colors.BLUE.SOFT}
                            maximumTrackTintColor={colors.BLUE.SOFT}
                            style={styles.seekBar}
                            value={position || 0}
                            onSlidingComplete={onSlidingComplete}
                        />
                        <Text style={{color: '#FFF'}}>{dateSecToString(active?.durationNumber! || 0)}</Text>
                    </View>

                    {/* Music Control */}

                    <View
                        style={styles.controlContainer}
                    >
                        <TouchableOpacity
                            disabled={isPrev && !loaded}
                            onPress={() => {
                                setIsPrev(true)
                                prev();
                            }}>
                            <FontAwesome5 name="backward" color={colors.WHITE.LIGHT} size={30} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={isClicked && !loaded}
                            onPress={async (e) => {
                                setIsClicked(true)
                                if(isPlay == undefined) {
                                    play()
                                } else {
                                    if(isPlay) {
                                        await pause()
                                    } else {
                                        await resume()
                                    }
                                }
                            }}
                        >
                            <View style={{
                                borderRadius: 100,
                                paddingHorizontal: 13,
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 10
                            }}>
                                <FontAwesome5
                                    name={isPlay ? "pause" : "play"}
                                    color={colors.WHITE.LIGHT}
                                    size={38}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={isNext && !loaded}
                            onPress={() => {
                                setIsNext(true);
                                next();
                            }}>
                            <FontAwesome5 name="forward" color={colors.WHITE.LIGHT} size={30} />
                        </TouchableOpacity>
                    </View>
            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    musicPlayer: {
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING + 20,
        marginHorizontal: SPACING * 2,
        alignItems: 'center'
    },
    headerTxt: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',
        maxWidth: 270,
        textAlign: 'center',
        paddingVertical: 10
    },
    button: {
        borderColor: colors.BLUE.ICON,
        borderWidth: 1,
        borderRadius: 140,
        alignSelf: 'center',
        padding: 5,
    },
     controlContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: SPACING * 2,
        marginVertical: SPACING * 2,
        paddingHorizontal: SPACING * 2,
        alignItems: 'center'
    },
    seekBarContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginHorizontal: SPACING,
        paddingHorizontal: SPACING * 2,
        alignItems: 'center',
    },
    seekBar: {
        width: '80%',
        borderColor: '#fff'
    }
});

export default SamplePlayer
