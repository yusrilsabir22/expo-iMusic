import { FontAwesome5 } from '@expo/vector-icons'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { View, Text, Animated, TouchableOpacity, Image, GestureResponderEvent, Easing, StyleSheet } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { YoutubeReducerState } from '../redux/reducers'
import { YoutubePlaylist } from '../types'
import { colors } from '../utils/color'
import { SCREEN_WIDTH, SPACING } from '../utils/screen'

type Props = {
    state: YoutubeReducerState;
    onPress: (event: GestureResponderEvent) => void;
    onLongPress: (event: GestureResponderEvent) => void;
    item: YoutubePlaylist;
    type: string;
    onSwipeAction: (videoId: string, type: string) => void;
    onLayout: (h: number) => void;
}

type RightSideProps = {
    progress: Animated.AnimatedInterpolation;
    dragX: Animated.AnimatedInterpolation;
    swipeAction: () => void;
    type: string
}

const RightSide: React.FC<RightSideProps> = ({progress, dragX, type, swipeAction}) => {
        const scale = progress.interpolate({
            inputRange: [0, 100],
            outputRange: [0, -350],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity onPress={swipeAction} activeOpacity={0.6} style={{justifyContent: 'center', alignItems: 'center'}}>
                <Animated.View style={[styles.deleteBox, {backgroundColor: type === "home" ? colors.MATERIAL.DARKEN.GREEN : colors.MATERIAL.DARKEN.RED,transform: [{translateX: scale}]}]}>
                    {
                        type === "home" ?
                        <FontAwesome5 name="plus" color="#fff" />
                        :
                        <FontAwesome5 name="trash" color="#fff" />
                    }
                </Animated.View>
            </TouchableOpacity>
        );
    };

const ItemSong: React.FC<Props> = ({state, onPress, onLongPress, item, type, onSwipeAction, onLayout}) => {
    const rotateAnim = useRef(new Animated.Value(0)).current
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

    const swipeAction = () => {
        if(type === "home") {
            onSwipeAction(item.videoId, "create")
        }

        if(type === "myplaylist") {
            onSwipeAction(item.videoId, "delete")
        }
    }

    useLayoutEffect(() => {
        startRotate()
    }, [state.active]);

    return (
        <View style={{marginTop: 0, justifyContent: 'center'}} onLayout={(ev) => {onLayout && onLayout(ev.nativeEvent.layout.height)}}>
            <Text style={{color: colors.BLACK.FONT, marginLeft: SPACING, marginTop: 15, fontSize: 12}}>{item.owner}</Text>
            <Swipeable renderRightActions={(progress, dragX) => {
                return (
                    <RightSide progress={progress} dragX={dragX} type={type} swipeAction={swipeAction} />
                )
            }} childrenContainerStyle={{padding: SPACING, marginTop: 0}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onLongPress={onLongPress}
                    onPress={onPress}
                    style={{ width: '90%' }}>
                    <View style={{backgroundColor: colors.WHITE.BG, padding: SPACING - 5, flexDirection: 'row', alignItems: 'center', borderRadius: 29, width: '100%'}}>
                        {
                            state && state.active && item.videoId === state.active.videoId ?
                            <Animated.Image
                                source={{uri: item.thumbnail}}
                                style={[rotateStyle, {
                                    width: 36,
                                    height: 36,
                                    resizeMode: 'cover',
                                    borderRadius: 18,
                                    left: -14
                                }]}
                            /> :
                            <Image
                                source={{uri: item.thumbnail}}
                                style={{
                                    width: 36,
                                    height: 36,
                                    resizeMode: 'cover',
                                    borderRadius: 18,
                                    left: -14
                                }}
                            />
                        }
                        <Text style={{color: 'white', fontSize: 12, maxWidth: 230}}>{item.title}</Text>
                    </View>
                </TouchableOpacity>
                <Text style={{color: colors.BLACK.FONT, width: '10%', marginHorizontal: 10, fontSize: 12}}>{item.durationText}</Text>
                </View>
                </Swipeable>
            </View>
    )
}

export default ItemSong

const styles = StyleSheet.create({
    deleteBox: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING,
        // marginVertical: SPACING,
        borderRadius: 14
    }
})