import React, { useLayoutEffect, useRef } from 'react'
import {ScrollView, RefreshControl, Animated, TouchableOpacity} from 'react-native'
import { View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { useDatabaseConnection } from '../../database/connection';
import { fetchYoutube } from '../../redux/action';
import { YoutubeReducerState } from '../../redux/reducers';
import { FETCH_YOUTUBE, SAVE_UPCOMING } from '../../redux/types';
import { colors } from '../../utils/color';
import { SPACING } from '../../utils/screen';
import ListCard from '../ListCard';

export const HomeTab = (props) => {
    const state = useSelector((state: YoutubeReducerState) => state);
    const dispatch = useDispatch();

    const animating = useRef(new Animated.Value(0)).current;
    const {initialRepo, playlistRepo, recentRepo, songRepo} = useDatabaseConnection()

    const startAnimation = () => {
        Animated.timing(animating, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
        }).start()
    }

    const resetAnimation = () => {
        Animated.timing(animating, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start()
    }

    const newMusicStyle = {
        opacity: animating.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        }),
        transform: [
            {
                translateY: animating.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, SPACING],
                    extrapolate: 'clamp'
                })
            }
        ]
    }

    useLayoutEffect(() => {
        if(state.newUpcoming) {
            startAnimation()
        } else {
            resetAnimation()
        }
    }, [state.newUpcoming])

    return (
        <View style={{position: 'relative', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.BLUE.PRIMARY}}>
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    zIndex: 20,
                    padding: 5,
                    borderRadius: 7,
                    backgroundColor: '#fff',
                    ...newMusicStyle
                }}
            >
                <TouchableOpacity style={{ backgroundColor: 'transparent'}} 
                onPress={() => {
                    dispatch({
                        type: SAVE_UPCOMING,
                        payload: {
                            initialRepo,
                            playlistRepo,
                            recentRepo,
                            songRepo,
                            newData: state.newData
                        }
                    })
                }}>
                    <Text style={{ backgroundColor: 'transparent', fontSize: 12, padding: 3}}>New Recomendations</Text>
                </TouchableOpacity>
            </Animated.View>
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={state.refreshing}
                    onRefresh={() => {
                        dispatch({type: FETCH_YOUTUBE, payload: {
                            initialRepo,
                            refresh: true
                        }})
                    }}
                />
            }
            style={{
                backgroundColor: colors.BLUE.PRIMARY,
            }}
            contentContainerStyle={{
                paddingBottom: SPACING * 8
            }}
            showsVerticalScrollIndicator={false}
        >
             { state !== null && state?.home !== null && state?.home?.length > 0  ? state.home.map((val, index) => {
                return (
                    <ListCard
                        key={val.cardTitle+index.toString()}
                        navigation={props.navigation}
                        route={props.route}
                        item={val}
                        indexCard={index}
                    />
                )
            }) : <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>No Data</Text></View>
        }
        </ScrollView>
        </View>
    )
}
