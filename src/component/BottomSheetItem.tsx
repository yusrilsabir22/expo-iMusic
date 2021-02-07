import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { PlaylistModel } from '../database/entities/playlist.model';
import { LIST_COLOR_MATERIAL } from '../utils/color';

type Props = {
    onPress: () => void;
    index: number;
    item: PlaylistModel
}

const BottomSheetItem: React.FC<Props> = ({onPress, index, item}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                style={{
                    backgroundColor: LIST_COLOR_MATERIAL[index % 10] ,
                    width: 150,
                    height: 150,
                    marginHorizontal: 10,
                    // opacity: .5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10
                }}
            >
                <Text style={{color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 24}}>{item.cardTitle}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default BottomSheetItem
