/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react';
import {
    View,
    StyleSheet,
    Button
} from 'react-native';
import { GlobalProps } from '../types';
import {colors} from '../utils/color';
import { SCREEN_HEIGHT, SCREEN_WIDTH, SPACING } from '../utils/screen';
import {useDispatch, useSelector} from 'react-redux'
import BaseScreen from '../component/BaseScreen';
import BaseInput from '../component/BaseInput';
import { SharedElement } from 'react-navigation-shared-element';
import { FETCH_YOUTUBE, INIT_DB, SET_REFRESHING, START_TOAST } from '../redux/types';
import { YoutubeReducerState } from '../redux/reducers';
import { useDatabaseConnection } from '../database/connection';
import ViewPager from '@react-native-community/viewpager';
import { LocalPlaylistTab, MyPlaylistTab, HomeTab, TestSVG } from '../component/Tab';

export const HomeScreen: React.FC<GlobalProps> = (props) => {
    const dispatch = useDispatch();
    const {initialRepo, recentRepo, songRepo, playlistRepo} = useDatabaseConnection()
    useEffect(() => {
        dispatch({
            type: FETCH_YOUTUBE,
            payload: {
                initialRepo,
                recentRepo, songRepo, playlistRepo,
                refresh: false
            }
        });
        return () => {
            dispatch({type: SET_REFRESHING, payload: false})
        }
    }, ['']);

    return (
        <BaseScreen
            navigation={props.navigation}
        >
            <View style={styles.contentContainer}>
                <SharedElement id="item.1.home-search">
                    <BaseInput
                        iconName={'search'}
                        iconColor={colors.BLACK.FONT}
                        iconSize={SPACING + 3}
                        placeholder={'Search music'}
                        onFocus={() => {
                            props.navigation.navigate('Search')
                        }}
                    />
                </SharedElement>
            </View>
            {/* <Button
                title="CLEAR RECENT HISTORY"
                onPress={async () => {
                    const cleared = await recentRepo.clearRecents()
                    if(cleared) {
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
                }}
            /> */}
            <View style={{flex: 1, zIndex: 2}}>
                {/* <MaterialTopTabViewNavigation /> */}
                <ViewPager
                    orientation="horizontal"
                    style={{flex: 1, height: SCREEN_HEIGHT}}
                    initialPage={1}

                >
                    <LocalPlaylistTab {...props} key={"0"}/>
                    <HomeTab {...props} key={"1"}/>
                    <MyPlaylistTab {...props} key={"2"} />
                    <TestSVG {...props} key={"3"} />
                </ViewPager>
            </View>
        </BaseScreen>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BLUE.PRIMARY,
        color: 'white',
        width: SCREEN_WIDTH,
    },
    contentContainer: {
        width: SCREEN_WIDTH,
        paddingTop: SPACING * 3,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        padding: SPACING,
        alignItems: 'center',
    },
    imgHeader: {
        resizeMode: 'cover',
        width: 30,
        height: 30,
        borderRadius: 15,
        // marginTop: SPACING,
    },
    imgContainer: {
        margin: SPACING,
    },
    searchBarContainer: {
        padding: SPACING,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.WHITE.PRIMARY,
        borderRadius: 20,
        height: 36,
        paddingHorizontal: SPACING * 2,
        marginHorizontal: SPACING,
        marginBottom: 20
    },
    searchBarIcon: {
        paddingHorizontal: SPACING,
    },
    searchBarText: {
        color: colors.WHITE.SOFT,
        paddingHorizontal: SPACING,
        fontSize: 15,
    },
    albumContainer: {},
    albumTxt: {
        color: colors.WHITE.LIGHT,
        fontSize: 24,
        fontWeight: 'bold',
        padding: SPACING,
    },
    albumImg: {
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
        fontSize: 10,
        marginTop: 4,
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
});