import React from 'react'
import { View, Modal } from 'react-native'

type Props = {
    visible: boolean;
    onRequestClose: () => void;
}

const SmallModal: React.FC<Props> = ({children, visible, onRequestClose}) => {
    return (
        <Modal
            animationType={"fade"}
            visible={visible}
            transparent={true}
            onRequestClose={onRequestClose}
            presentationStyle={"overFullScreen"}
        >
            <View style={{backgroundColor: '#000', opacity: .9, flex: 1}}>
                {children}
            </View>
        </Modal>
    )
}

export default SmallModal
