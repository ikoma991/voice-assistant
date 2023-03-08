import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const OutlinedBtn = ({text,borderColor,textColor,onPressFn}) => {
    const styleWithBorderColor = `${borderColor} bg-transparent border p-4 w-full rounded-full mb-3 `
    const styleWithTextColor = `${textColor} text-xl text-center font-bold `
  return (
    <TouchableOpacity className={styleWithBorderColor} onPress={onPressFn}>
        <Text className={styleWithTextColor}>{text}</Text>
    </TouchableOpacity>
  )
}

export default OutlinedBtn