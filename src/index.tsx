import React, { useRef, useEffect, useCallback } from "react"
import { Animated } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { useDispatch, useSelector } from "react-redux"
import SamplePlayer from "./component/SamplePlayer"
import {MainSharedStackNavigation} from "./config/navigation"
import { useDatabaseConnection } from "./database/connection"
import { INIT_DB, RESET_TOAST } from "./redux/types"
import { YoutubeReducerState } from "./redux/reducers"
import { SCREEN_HEIGHT } from "./utils/screen"
import BottomSheet from "./component/BottomSheet"
import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaView } from "react-native-safe-area-context"

// export const fff = 'a';
const MyApp = () => {
    const animating = useRef(new Animated.Value(0)).current
    const {playlistRepo, songRepo, initialRepo, recentRepo} = useDatabaseConnection()
    const dispatch = useDispatch()
    const state = useSelector((state: YoutubeReducerState) => state)

    const startAnimating = () => {
      Animated.timing(animating, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start()
    }

    const resetAnimating = () => {
      Animated.timing(animating, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start()
    }

    const playerStyle = {
      opacity: animating.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
        extrapolate: 'clamp'
      }),
      transform: [
        {
          translateY: animating.interpolate({
            inputRange: [0, 1],
            outputRange: [0, SCREEN_HEIGHT + 300],
            extrapolate: 'clamp'
          })
        }
      ]
    }

    const preventAutoHideAsync = useCallback(async () => {
      try {
        await SplashScreen.preventAutoHideAsync()
      } catch (error) {
        console.log('splashscreen:error:', error)
      }
    }, []);

    const hideAsync = useCallback(async () => {
      try {
        await SplashScreen.hideAsync()
      } catch (error) {
        console.log('splashscreen:hideasync:error', error)
      }
    }, [])

    useEffect(() => {
      preventAutoHideAsync()
      startAnimating()
      // resetAnimating()
      animating.addListener(({value}) => {
        if(value === 1) {
          dispatch({type: RESET_TOAST})
        }
      });
    }, [])

     useEffect(() => {
      dispatch({
          type: INIT_DB,
          payload: {
              playlistRepo,
              songRepo,
              initialRepo,
              recentRepo
          }
      })
    }, [playlistRepo, songRepo])

    useEffect(() => {
      if(state.active == null && state.recents.length <= 0) {
        startAnimating()
      } else {
        resetAnimating()
      }
    }, [state.active, state.recents]);

    useEffect(() => {
      if(state.appReady) {
        hideAsync()
      }
    }, [state.appReady])

    if(!state.appReady) {
      return null
    }


    return (
      <React.Fragment>
        <NavigationContainer>
          <MainSharedStackNavigation/>
        </NavigationContainer>
        <SamplePlayer
          animStyle={playerStyle}
        />
        <BottomSheet/>
      </React.Fragment>
    )
}

export default MyApp;