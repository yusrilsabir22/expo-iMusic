import React from 'react'
import { View, Text, FlatList, TouchableHighlight } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { YoutubeReducerState } from '../../redux/reducers'
import { SAVE_PLAYLIST } from '../../redux/types'
import { colors, LIST_COLOR_MATERIAL } from '../../utils/color'
import { SCREEN_HEIGHT, SCREEN_WIDTH, SPACING } from '../../utils/screen'

export const MyPlaylistTab = ({navigation, ...props}) => {
    const dispatch = useDispatch()

    const playlists = useSelector((state: YoutubeReducerState) => state.myPlaylist)

    return (
        <View style={{
            backgroundColor: colors.BLUE.PRIMARY,
            width: SCREEN_WIDTH,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0
        }}>
            <Text>Recent Played</Text>
            <FlatList
                data={playlists}
                keyExtractor={(val, index) => index+""}
                style={{width: SCREEN_WIDTH, paddingHorizontal: 20, marginBottom: 80}}
                renderItem={({item, index: indexCard}) => {
                    return (
                        <TouchableHighlight key={indexCard} onPress={() => {
                            // dispatch({type: SET_LOADING});
                            dispatch({type: SAVE_PLAYLIST, payload: {data: item.items, title: item.cardTitle}});
                            // @ts-ignore
                            navigation.navigate('Playlist', {data: {...item, from: 'myplaylist',title: item.cardTitle}, indexCard});
                        }}>
                            <View style={{padding: SPACING, marginVertical: SPACING, height: 150, borderRadius: 5, backgroundColor: LIST_COLOR_MATERIAL[indexCard % 10]}}>
                                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 24}}>{item.cardTitle}</Text>
                            </View>
                        </TouchableHighlight>
                    )
                }}
                ListEmptyComponent={() => {
                    return (
                        <View  style={{flex: 1, height: SCREEN_HEIGHT * 0.7, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center'}}>No Playlist</Text>
                        </View>
                    )
                }}
            />
        </View>
    )
}
