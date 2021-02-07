import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { SharedElement } from 'react-navigation-shared-element';
import { useDispatch } from 'react-redux';
import { SET_LOADING } from '../redux/types';
import { GlobalProps, ListPlaylist, YoutubeAPIResponse } from '../types';
import { colors } from '../utils/color';
import { SPACING } from '../utils/screen';

type ListCardItemProps= GlobalProps & {
    value: ListPlaylist;
    indexCard: number;
}

type ListCardProps = GlobalProps & {
    item: YoutubeAPIResponse,
    indexCard: number;
}

const ListCardItem: React.FC<ListCardItemProps> = ({value, navigation, indexCard}) => {

    const dispatch = useDispatch()
    const nav = useNavigation()

    return (
        <TouchableHighlight
            onPress={() => {
                dispatch({type: SET_LOADING});
                // @ts-ignore
                nav.navigate('Playlist', {data: {...value, from: 'home'}, indexCard});
            }}
            >
            <View style={styles.albumContainer}>
                <SharedElement id={`item.${value.playlistId}-${indexCard}.photo`} style={{...StyleSheet.absoluteFillObject}}>
                    <Image
                        style={styles.albumImg}
                        source={{
                            uri: value.thumbnail,
                        }}
                    />
                </SharedElement>
                <SharedElement id={`item.${value.playlistId}-${indexCard}.overlay`} style={{...StyleSheet.absoluteFillObject}}>
                    <View style={[{backgroundColor: '#000', opacity: 0.7}]} />
                </SharedElement>
                <SharedElement id={`item.${value.playlistId}-${indexCard}.text`}>
                    <Text style={styles.albumTitle}>{value.title}</Text>
                </SharedElement>
            </View>
        </TouchableHighlight>
    )
}

const ListCard: React.FC<ListCardProps> = ({item, navigation, route, indexCard}) => {
    return (
        <View
            style={{
                marginTop: SPACING * 2,
            }}>
            <Text
                style={styles.albumTxt}>{item.cardTitle}</Text>
            <FlatList
                horizontal={true}
                contentContainerStyle={{paddingHorizontal: SPACING}}
                data={item.items}
                keyExtractor={(v, i) => i + ''}
                renderItem={({item: value}) => {
                    return (
                        <ListCardItem indexCard={indexCard} navigation={navigation} route={route} value={value} />
                    );
                }}
                maxToRenderPerBatch={5}
                initialNumToRender={10}
                updateCellsBatchingPeriod={30}
                onEndReachedThreshold={0.3}
                removeClippedSubviews={false}
                windowSize={5}
                legacyImplementation={false}
            />
        </View>
    )
}

export default ListCard

const styles = StyleSheet.create({
    albumContainer: {
        position: 'relative',
        width: 180,
        height: 187,
    },
    albumTxt: {
        color: colors.WHITE.LIGHT,
        fontSize: 24,
        fontWeight: 'bold',
        padding: SPACING,
    },
    albumImg: {
        position: 'absolute',
        width: 160,
        height: 167,
        resizeMode: 'cover',
        borderRadius: 20,
        marginRight: 20,
    },
    albumOwner: {
        color: colors.WHITE.LIGHT,
        fontSize: 16,
        marginTop: 13,
    },
    albumTitle: {
        color: colors.WHITE.LIGHT,
        opacity: 0.55,
        fontSize: 12,
        marginTop: 4,
        position: 'absolute',
        top: 167 + 3
    },
})
