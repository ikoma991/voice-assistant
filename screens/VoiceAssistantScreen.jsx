import { View,Image, ScrollView,TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons';

import { useState } from 'react';
import { useColorScheme } from 'nativewind';
import axios from 'axios';
import * as Speech from 'expo-speech';

import Logo from '../assets/logo.png'
import ChatMessage from '../components/ChatMessage';

const OPENAI_API = "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";

const VoiceAssistantScreen = () => {
  const [chatList,setChatList] = useState([{}])
  const [message,setMessage] = useState('');
  const [isBusy,setIsBusy]  = useState(false);

  const { toggleColorScheme } = useColorScheme();

  const toggleTheme = () => {
    toggleColorScheme();
  }
  const addResponse = (text) => {
    setChatList(state=>  [...state.filter((el,idx)=> idx !== state.length-1 ),{type:'bot',text}]);
    
  }

  const getResponseFromDuckDuckGo = async (text) => {
    const res = await axios.get(`http://api.duckduckgo.com/?q=${text.replace(" ","+")}&format=json`);
    return res.data["Abstract"];
  }

  const getResponseFromOpenAI = async (text) => {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API}`
      }
      const data = {
        prompt:text,
        model:'text-davinci-003',
        temperature: 0.7,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }
      try{
        const openai = await axios.post('https://api.openai.com/v1/completions',data,{headers:headers});
        return openai.data.choices[0].text.trim()
      }catch (err) {
        console.log(err);
      }
  }

  const sendCommand = async () => {
    if(message !== '') {
      setChatList([...chatList,{type:'user',text:message}]);
      setMessage('');

      setIsBusy(true);
      setChatList(state=> [...state,{type:'bot',text:'.......'}]);

      const messageLowered = message.toLowerCase();
      let response = '';

      if(messageLowered.includes('hello')) {
        response = 'Hello! I am your personal Assistant';
      }else if (messageLowered.includes('how are you')){
        response = 'I am doing good, and you?'
      }else if (messageLowered.includes('change theme')){
        addResponse('Changing theme...');
        Speech.speak('Changing theme');
        setTimeout(toggleTheme,2000);
        response = 'Theme has been changed!';
      }else {

        
        const resultFromDuckDuckGo = await getResponseFromDuckDuckGo(messageLowered);
        if(resultFromDuckDuckGo !== '') {
          response = resultFromDuckDuckGo;
        }else {
          const resultFromOpenAI = await getResponseFromOpenAI(messageLowered);
          response = resultFromOpenAI;
          // response = "Sorry that command isn't supported yet";
        }
      }

      setTimeout(()=> {
        addResponse(response);
        if(response.length > 50) {
          Speech.speak("Here is what I found",{language:'en-GB'});
        }else {
          Speech.speak(response);
        }
        setIsBusy(false);
      },2000)


    }

  }
  return (
    <KeyboardAvoidingView  className='dark:bg-zinc-900 h-full ' behavior='padding'  >

      <View className='w-5/6 mx-auto  '>

        <View className = "flex-row items-center justify-between">
          <Image 
            source = {Logo}
            className = "w-14 h-20" 
          />

            <Ionicons 
              name="settings-outline" 
              size={30} 
              color="#7c3aed"
            />
        </View>

        <ScrollView 
          className="h-3/5 mb-4"
          contentContainerStyle={{
            padding:25,
          }}
        >

          <ChatMessage type='bot' text='Hello World!' />

          {chatList.map( (el,idx) => (<ChatMessage type={el.type} text ={el.text} key={idx} />))
          }

        </ScrollView>

        <View className='flex-row justify-center items-center  rounded-full border-2 p-3 border-gray-300 mb-4'>
          <TextInput
            value = {message}
            onChangeText={setMessage}
            placeholder='Enter a message...'
            className='dark:text-white flex-1 text-lg p-3'
            multiline
            autoFocus
            blurOnSubmit={true}
            onSubmitEditing={sendCommand}
            placeholderTextColor='#9ca3af'
            editable={!isBusy}
          
          />
          <TouchableOpacity
            className='bg-violet-600 rounded-full p-1'
            onPress={sendCommand}
            disabled={isBusy}
          >
            <Ionicons
              name = 'arrow-up'
              size={28}
              color='white'
            />
          </TouchableOpacity>
        </View>

        <View className='w-full'>
           <TouchableOpacity
            className='bg-violet-600 rounded-full p-2 self-start mx-auto'
            
           >
             <Ionicons 
              name='mic-outline'
              size={32}
              color='white'
             />
           </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default VoiceAssistantScreen