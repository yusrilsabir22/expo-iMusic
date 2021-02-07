import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SharedElement } from 'react-navigation-shared-element'
import { colors } from '../utils/color'
import { SPACING } from '../utils/screen'

const BaseHeader = () => {
    return (
        <SharedElement id="item.1.base-header">
            <View style={styles.headerContainer}>
                <Text style={{color: colors.BLUE.SOFT, fontSize: SPACING * 2, position: 'absolute', top: SPACING * 2 + 5}}>iMusic</Text>
            </View>
        </SharedElement>
    )
}

export default BaseHeader;

const styles = StyleSheet.create({
      headerContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: SPACING * 2,
        // height: 50,
        padding: SPACING,
    },
    imgContainer: {
        margin: SPACING,
    },
})
