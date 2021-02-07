import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { colors } from '../utils/color'

const Loading = () => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor: 'rgba(1, 1, 1, 0.0)'}}>
            <ActivityIndicator size={50} color={colors.BLUE.SOFT} />
        </View>
    )
}

export default Loading
