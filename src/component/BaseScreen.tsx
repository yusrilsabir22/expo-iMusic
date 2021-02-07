import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { View, StyleSheet, BackHandler, Animated } from 'react-native'
import { useSelector } from 'react-redux'
import { YoutubeReducerState } from '../redux/reducers'
import { PlayerScreen } from '../types'
import { colors } from '../utils/color'
import BaseHeader from './BaseHeader'

type Props = {
    header?: JSX.Element;
    navigation: any,
    router?: any
}

const BaseScreen: React.FC<Props> = ({children, navigation, ...props}) => {
    // const mode = useSelector((state: YoutubeReducerState) => state.player)
    // const handler = () => {
    //     console.log('BackHandler', mode)
    //     if(mode === PlayerScreen.full) {
    //         return true;
    //     } else {
    //         navigation.goBack()
    //         return false;
    //         // console.log(props)
    //         // @ts-ignore
    //         // props.navigation.goBack()
    //     }
    // }

    // useEffect(() => {
    //     const handlerListener = BackHandler.addEventListener('hardwareBackPress', handler)
    //     return () => {
    //         handlerListener.remove()
    //     }
    // }, [])

    
    return (
        <View style={styles.container}>
            {props.header ? props.header : <BaseHeader/>}
            {children}
        </View>
    )
}

export default BaseScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BLUE.PRIMARY,
        color: 'white'
    }
})
