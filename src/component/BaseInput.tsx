import { FontAwesome5 } from '@expo/vector-icons'
import React, { useState } from 'react'
import { View, TextInput, TextInputProps, ActivityIndicator, TouchableOpacity } from 'react-native'
import { colors } from '../utils/color'
import { SPACING } from '../utils/screen'

type Props = TextInputProps & {
    iconName?: string;
    iconSize?: number;
    iconColor?: string;
    loading?: boolean;
}

const BaseInput: React.FC<Props> = (props) => {

    const [notNull, setNotNull] = useState('')

    return (
        <View style={{paddingHorizontal: SPACING * 2}}>
            <FontAwesome5
                name={props.iconName}
                style={{
                    position: 'absolute',
                    left: SPACING * 2 + 10,
                    zIndex: 2,
                    top: SPACING * 2 - 2
                }}
                color={props.iconColor || colors.BLACK.FONT}
                size={props.iconSize || SPACING + 3}
            />
            <TextInput
                style={{
                    padding: 5,
                    backgroundColor: colors.BLUE.ICON,
                    borderRadius: 10,
                    marginVertical: SPACING,
                    paddingLeft: SPACING * 3
                }}
                value={notNull}
                onChange={(e) => setNotNull(e.nativeEvent.text)}

                {...props}
            />
            {
                props.loading && <ActivityIndicator style={{
                    position: 'absolute',
                    right: SPACING * 2 + 10,
                    zIndex: 2,
                    top: SPACING * 2 - 2
                }} color={props.iconColor || colors.BLACK.FONT} size={props.iconSize || SPACING + 3} />
            }
            {
                !props.loading && notNull !== '' && <TouchableOpacity style={{position: 'absolute',
                    right: SPACING * 2 + 15,
                    zIndex: 2,
                    top: SPACING * 2 - 2}} onPress={() => setNotNull('')}>
                <FontAwesome5 name={'times'} color={'tomato'}
                size={props.iconSize || SPACING + 3} />
            </TouchableOpacity>
            }
        </View>
    )
}

export default BaseInput
