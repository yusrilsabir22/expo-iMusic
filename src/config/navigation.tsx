import React from 'react';

import {StackNavigationProp} from '@react-navigation/stack';
import { RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createMaterialTopTabNavigator, MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import {HomeScreen, PlaylistScreen, SearchScreen} from '../screen'
import {HomeTab, LocalPlaylistTab, MyPlaylistTab} from '../component/Tab'
import { Easing } from 'react-native';
type MainStackNavigation = {
    Home: undefined,
    Playlist: undefined,
    Search: undefined
}

type RootStackNavigation = {
    Main: MainStackNavigation,
    Modal: undefined
}

type TabViewStackNavigation = {
    TabHome: undefined;
    MyPlaylist: undefined;
    Local: undefined;
}

export type MainScreenNavigationProp = StackNavigationProp<MainStackNavigation, 'Home'>;
export type MainScreenRouteProps = RouteProp<MainStackNavigation, 'Home'>
export type RootScreenNavigationProp = CompositeNavigationProp<StackNavigationProp<RootStackNavigation, 'Main'>, MainScreenNavigationProp>
export type RootScreenRouteProps = RouteProp<RootStackNavigation, 'Main'>
export type TabViewNavigationProps = MaterialTopTabNavigationProp<TabViewStackNavigation, 'TabHome'>
const MainSharedScreen = createSharedElementStackNavigator<MainStackNavigation>()
const RootSharedScreen = createSharedElementStackNavigator<RootStackNavigation>()
const TabView = createMaterialTopTabNavigator<TabViewStackNavigation>()

export const MainSharedStackNavigation: React.FC<{}> = (props) => {
    return (
        <MainSharedScreen.Navigator
            initialRouteName="Home"
            headerMode="none"
            mode="card"
        >
            <MainSharedScreen.Screen
            name="Home"
            // options={navigation => ({
            //     cardStyleInterpolator: ({current: {progress}, layouts}) => {
            //             return {
            //                 cardStyle: {
            //                     opacity: progress.interpolate({
            //                         inputRange: [0, 0.5, 1],
            //                         outputRange: [0, 0.1, 1]
            //                     }),
            //                     transform: [
            //                         {
            //                             scale: progress.interpolate({
            //                                 inputRange: [0, 0.5, 1],
            //                                 outputRange: [1,3, 1],
            //                                 extrapolate: 'clamp'
            //                             })
            //                         }
            //                     ]
            //                 }
            //             }
            //         }
            // })}
            component={HomeScreen} />
            <MainSharedScreen.Screen
                name="Playlist"
                component={PlaylistScreen}
                options={navigation => ({
                    cardStyleInterpolator: ({current: {progress}, layouts}) => {
                        return {
                            cardStyle: {
                                opacity: progress,
                                transform: [
                                    {
                                        translateY: progress.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [layouts.screen.height, 0],
                                        })
                                    }
                                ]
                            }
                        }
                    }
                })}
                sharedElements={({params}) => {
                    const {data, indexCard} = params
                    return [
                        {
                            id: `item.${data.playlistId}-${indexCard}.photo`,
                            animation: 'move',
                            resize: 'clip',
                            align: 'right-center'
                        },
                        {

                            id: `item.${data.playlistId}-${indexCard}.text`,
                            animation: 'fade',
                            resize: 'clip',
                            align: 'center-top'
                        },
                        {
                            id: `item.${data.playlistId}-${indexCard}.overlay`,
                            animation: 'fade-in',
                            resize: 'clip',
                            align: 'right-center'
                        }
                    ]
                }}
            />
             <MainSharedScreen.Screen
                name="Search"
                component={SearchScreen}
                options={navigation => ({
                    cardStyleInterpolator: ({current: {progress}, layouts}) => {
                        return {
                            cardStyle: {
                                opacity: progress
                                .interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [0, 0.1, 1]
                                }),
                                transform: [
                                    {
                                        translateY: progress.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [layouts.screen.height, 0],
                                        })
                                    }
                                ]
                            }
                        }
                    }
                })}
                sharedElements={(route) => {
                    return [
                        {
                            id: 'item.1.home-search',
                            animation: 'fade',
                            resize: 'auto',
                            align: 'center-top'
                        },
                        {
                            id: 'item.1.base-header',
                            animation: 'fade',
                            resize: 'auto',
                            align: 'center-top'
                        }
                    ]
                }}
            />
        </MainSharedScreen.Navigator>
    )
}

export const MaterialTopTabViewNavigation = () => {
    return (
        <TabView.Navigator 
            initialRouteName="TabHome"
            tabBarOptions={{
                style: {
                    backgroundColor: 'transparent'
                },
                activeTintColor: '#fff'
            }}
            style={{
                 backgroundColor: 'transparent'
            }}
        >
            <TabView.Screen name="Local" options={{tabBarLabel: 'Recent'}} component={LocalPlaylistTab}/>
            <TabView.Screen name="TabHome" options={{tabBarLabel: 'Home'}}  component={HomeTab} />
            <TabView.Screen name="MyPlaylist" options={{tabBarLabel: 'Playlist'}} component={MyPlaylistTab} />
        </TabView.Navigator>
    )
}


export const RootSharedStackNavigation = () => {
    return (
        <RootSharedScreen.Navigator
            initialRouteName="Main"
            headerMode="none"
        >
            <RootSharedScreen.Screen name="Main" component={MainSharedStackNavigation} />
            <RootSharedScreen.Screen
                name="Modal"
                component={SearchScreen}
                 options={navigation => ({
                    cardStyleInterpolator: ({current: {progress}}) => {
                        return {
                            cardStyle: {
                                opacity: progress
                            }
                        }
                    }
                })}
                sharedElements={(route) => {
                    return [
                        {
                            id: 'item.1.home-search',
                            animation: 'move',
                            resize: 'clip',
                            align: 'center-top'
                        },
                        {
                            id: 'item.1.base-header',
                            animation: 'move',
                            resize: 'clip',
                            align: 'center-top'
                        }
                    ]
                }}
            />
        </RootSharedScreen.Navigator>
    )
}