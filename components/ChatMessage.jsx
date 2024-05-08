import { View, Text } from 'react-native'
import React from 'react'

const ChatMessage = ({type,text}) => {

    const getContainerStyles = (type) => {
        if (type === 'user') {
            return `bg-violet-600 rounded-l-3xl rounded-br-3xl py-2 flex-1 self-end mb-4 m-w-xs`
        }else if (type === 'bot') {
            return `py-2 flex-1 self-start mb-4 m-w-xs border-2 border-violet-600 rounded-r-3xl rounded-bl-3xl`;
        }
    }

    const getTextStyles= (type) => {
        if(type === 'user') {
            return 'text-xl text-white font-semibold px-4 text-justify'
        }else if(type ==='bot') {
            return 'text-xl dark:text-white font-semibold px-4 text-justify'
        }
    }

    const containerStyles = getContainerStyles(type);
    const textStyles = getTextStyles(type);

  return (
    <View 
        className={containerStyles}>

        <Text 
            className={textStyles}>
            {text}
        </Text>
    </View>
  )
}

export default ChatMessage