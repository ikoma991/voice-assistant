import { View,Modal,TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { WebView } from 'react-native-webview';

import React from 'react'

const ModalMessage = ({url,type,show,setModal}) => {
  return (
    <Modal visible={show} >
        <TouchableOpacity className="bg-zinc-800" onPress={()=> setModal(state=>({...state,show:false}) )} >
        <Ionicons name='close' size={40} color="white" />         
        </TouchableOpacity>
        <View className="bg-zinc-800">
            <View
            style={{
                marginVertical: 5,
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom:20
            }}>
            <View
            style={{
                height: '100%',
                borderRadius: 20,
                width: '100%',
                overflow: 'hidden'
            }}>  
            <WebView
            source={{
                // uri: encodeURI('https://poki.com/'),
                uri: encodeURI(url),
            }}
            style={{opacity:0.99}}
            />
            </View>
        </View>
    </View>
    </Modal>
  )
}

export default ModalMessage