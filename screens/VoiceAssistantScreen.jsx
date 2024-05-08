import { View, Image, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { useNavigation } from '@react-navigation/native';

import Ionicons from '@expo/vector-icons/Ionicons';

import { useEffect, useRef, useState } from 'react';
import { useColorScheme } from 'nativewind';
import axios from 'axios';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';
import * as Linking from "expo-linking";

import Logo from '../assets/logo.png'
import ChatMessage from '../components/ChatMessage';
import { getResponseFromOpenAI } from '../utilities/openai';
import { openApp } from '../utilities/openApp'
import ModalMessage from '../components/ModalMessage';
import GoogleMessage from '../components/GoogleMessage';
import * as Contacts from 'expo-contacts'

const VoiceAssistantScreen = () => {
  const navigation = useNavigation(); 
  const [chatList, setChatList] = useState([])
  const [message, setMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [modalData, setModalData] = useState({
    url: '',
    type: '',
    show: false,
  });
  const [voiceData, setVoiceData] = useState({
    recognized: false,
    pitch: "",
    error: "",
    end: false,
    started: false,
    results: [],
    partialResults: [],
  });
  const scrollViewRef = useRef(null);


  const { toggleColorScheme } = useColorScheme();

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechError = onSpeechErrorHandler;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      Speech.stop();
    }
  }, []);

  useEffect(() => {
    setMessage(voiceData.partialResults[0]);
  }, [voiceData.partialResults]);

  // useEffect(() => {
  //   if (voiceData.end && voiceData.results[0] && voiceData.results[0] !== "") {
  //     console.log("use Effect result: ", voiceData.results[0]);
  //     setMessage("");
  //     sendCommand(voiceData.results[0]);
  //     console.log(voiceData);
  //   }
  // }, [voiceData.results]);

  const onSpeechPartialResults = (e) => {
    console.log("onSpeechPartialResults: ", e);
    setVoiceData({
      ...voiceData,
      partialResults: e.value,
    });

  }

  const onSpeechRecognized = (e) => {
    console.log("onSpeechRecognized: ", e);
    setVoiceData({
      ...voiceData,
      recognized: true
    });

  }

  const onSpeechStartHandler = async (e) => {
    console.log("onSpeechStart: ", e);
    setVoiceData({
      recognized: false,
      pitch: "",
      error: "",
      end: false,
      started: true,
      results: [],
      partialResults: [],
    });
  }

  const onSpeechEndHandler = async (e) => {
    console.log("onSpeechEnd: ", e);
    setVoiceData({
      ...voiceData,
      end: true,
      started: false,
      recognized: false
    });
    console.log(voiceData.results);

  }

  const onSpeechResultsHandler = (result) => {
    console.log("onSpeechResults: ", result);
    setVoiceData({
      ...voiceData,
      results: result.value,
    });
    setMessage("");
    sendCommand(result.value[0]);

  }
  const onSpeechErrorHandler = (err) => {
    console.log("onSpeechError: ", err);
    setVoiceData({
      ...voiceData,
      error: JSON.stringify(err.error),
    });
  }


  const startRecognizing = async () => {
    Speech.stop();
    try {
      await Voice.start("en-US");

      onSpeechStartHandler();
    } catch (e) {
      console.error(e);
    }
  }

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }
  // const cancelRecognizing = async () => {
  //   try {
  //     await Voice.cancel();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  // const destroyRecognizor = async () => {
  //   try {
  //     await Voice.destroy();
  //   } catch (e) {
  //     console.error(e);
  //   }
  //   setVoiceData({
  //     recognized: false,
  //     pitch: "",
  //     error: "",
  //     started: false,
  //     results: [],
  //     partialResults: [],
  //     end: false,
  //   });
  // }

  const addMessage = (type, text, mt = null, index ) => {
    switch (type) {
      case 'google':
        return (<GoogleMessage key={index} query={text} mt={mt} />)
      default:
        return (<ChatMessage type={type} text={text} key={index} />)
    }
  }
  const addResponse = (text, type) => { setChatList(state => [...state, { type, text }]) }

  const getResponseFromDuckDuckGo = async (text) => {
    const res = await axios.get(`http://api.duckduckgo.com/?q=${text.replace(" ", "+")}&format=json`);
    return res.data["Abstract"];
  }

  const getPredictedPrice = async (symbol,count) => {
    const coinSymbolUpper = symbol.toUpperCase();
    // const coinsDetailRes = await axios.get(`https://coincodex.com/apps/coincodex/cache/all_coins.json`);
    const coinsDetailRes = await axios.get(`https://coincodex.com/api/coincodex/get_coin/${coinSymbolUpper}`);
    const coinInfo = coinsDetailRes.data;
    // const coinName = allCoins.filter(el=> el.symbol === coinSymbolUpper)[0].shortname;
    const coinName = coinInfo.shortname;
    const res = await axios.get(`https://coincodex.com/api/predictions/get_byshortname/${coinName}`);
    const thirtyDayPredictionArr = res.data['thirtyDayPrediction'];
    const thirtyDayPredictionPrices = thirtyDayPredictionArr.map(el => Math.round(el[1]) );
    return thirtyDayPredictionPrices[count];
  }

  const removeCommandFromMessage = (messageArr, commandArr, message) => {
    let newMessage = message;
    messageArr.forEach(el => {
      if (commandArr.includes(el)) {
        newMessage = newMessage.replace(el, "");
      }
    });
    return newMessage.trim();
  }

  const sendCommand = async (messageFromArgs) => {
    Speech.stop();
    const msg = message || messageFromArgs;
    console.log(msg);
    if (msg !== '') {
      addResponse(msg, 'user');
      setMessage('');
      setIsBusy(true);

      const messageLowered = msg.toLowerCase().trim();
      const messageArr = messageLowered.split(" ");
      let response = '';
      const greetings = ['hello', 'hi', 'bonjour', 'hola', 'salam', 'assalam alaikum', 'salam alaikum', 'namaste', 'adaab', 'good morning', 'good evening'];
      const questionCommands = ['who', 'how', 'what', 'where', 'which', 'whats', 'what\'s', 'whos', 'who\'s', 'wheres', 'where\'s', 'hows'];
      const googleCommands = ['google','search','google search'];
      const weatherCommands = ['weather','temperature'];
      const priceCommands = ['price'];
      const translateCommands = ['translate'];
      const calculateCommands = ['calculate'];
      const locationCommands = ['locate'];

      if (greetings.includes(messageLowered)) {

        response = 'Hello! I am your personal assistant. How can I help you?';

      } else if (messageLowered == 'how are you') {
        response = 'I am doing good, and you?'

      } else if (messageLowered.includes('change theme')) {

        addResponse('Changing theme...', 'bot');
        Speech.speak('Changing theme');
        setTimeout(toggleColorScheme, 2000);
        response = 'Theme has been changed!';

      } else if (messageLowered.startsWith("open")) {

        console.log("OPENING APP!!: ");
        // const appName = messageLowered.replace('open',"").trim().replace(" ","-");
        const appName = messageLowered.replace('open', " ").trim()
        addResponse(`Opening ${appName}`, 'bot');
        Speech.speak(`Opening ${appName}`);
        setTimeout(() => openApp(appName), 2000);
        response = `Opened ${appName}`;

      } else if (googleCommands.includes(messageArr[0])) {

        console.log(messageLowered);        
        const messageWithoutCommand = removeCommandFromMessage(messageArr,googleCommands,messageLowered);
        addResponse('Processing your request...', 'bot');
        Speech.speak('Processing your request');
        setChatList(state => [...state, { type: 'google', text: messageWithoutCommand }]);
        response = 'Here is what I found!';
        
      } else if (questionCommands.includes(messageArr[0])) {
        console.log(messageLowered);
        const resultFromDuckDuckGo = await getResponseFromDuckDuckGo(messageLowered);
        if (resultFromDuckDuckGo !== '') {
          response = resultFromDuckDuckGo;
        } else {
          const resultFromOpenAI = await getResponseFromOpenAI(messageLowered);
          response = resultFromOpenAI;
          // response = "Sorry that command isn't supported yet";
        }

      } else if (weatherCommands.includes(messageArr[0])) {

        console.log(messageLowered);
        addResponse('Processing your request...', 'bot');
        Speech.speak('Processing your request');
        setChatList(state => [...state, { type: 'google', text: messageLowered }]);
        response = 'Here is what I found!';

      } else if (priceCommands.includes(messageArr[0])) {

        console.log(messageLowered);
        addResponse('Processing your request...', 'bot');
        Speech.speak('Processing your request');
        setChatList(state => [...state, { type: 'google', text: messageLowered }]);
        response = 'Here is what I found!';

      } else if (translateCommands.includes(messageArr[0])) {

        console.log(messageLowered);
        addResponse('Processing your request...', 'bot');
        Speech.speak('Processing your request');
        setChatList(state => [...state, { type: 'google', text: messageLowered, mt:-90 }]);
        response = 'Here is what I found!';

      } else if (calculateCommands.includes(messageArr[0])) {

        const messageWithoutCommand = removeCommandFromMessage(messageArr, calculateCommands, messageLowered);
        addResponse('Processing your request...', 'bot');
        Speech.speak('Processing your request');
        setChatList(state => [...state, { type: 'google', text: messageWithoutCommand }]);
        response = 'Here is what I found!';

      } else if (locationCommands.includes(messageArr[0])) {

        const location = messageArr.slice(1,messageArr.length).join(" ");
        addResponse('Processing your request...', 'bot');
        Speech.speak('Processing your request');
        setTimeout(() => Linking.openURL(`geo:0,0?q=${location}`) , 2000);
        response = 'Here is what I found!';

      } else if (messageLowered.startsWith("play music")) {

        const song = messageLowered.replace("play music", "").trim();
        console.log(song);
        response = `Playing ${song}`;
        setTimeout(() => {
          setModalData({ url: `https://m.soundcloud.com/search?q=${song}`, type: 'play_music', show: true, })
        }, 2000)

      } else if (messageLowered.startsWith("play game")) {
        // const gameName = messageLowered.replace("play game", "").trim();
        response = "Sure let's play !"
        setTimeout(() => {
          setModalData({ url: `https://poki.com`, type: 'play_game', show: true, })
        }, 2000)

      } else if (messageLowered.startsWith("predict")) {

        console.log("prediction handler ");
        const coinSymbol = messageArr[1];
        const afterHowManyDays = messageArr[3];
        try{
          const predictedPrice = await getPredictedPrice(coinSymbol,afterHowManyDays-1);
          if(predictedPrice){
            response = `Price of ${coinSymbol} after ${afterHowManyDays} days will be $${predictedPrice}`;
          }else {
            console.log("No predicted price. ");
            response = "Sorry couldn't find the coin or the format is incorrect";
          }
        }catch(err) {
          response = "Sorry something went wrong";
        }

      } else if (messageLowered.startsWith("call")) {
        
        console.log("Call Handler");
        let contacts;
        const messageWithoutCommand = removeCommandFromMessage(messageArr,["call"],messageLowered);

        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Birthday, Contacts.Fields.Emails, Contacts.Fields.FirstName, Contacts.Fields.LastName, Contacts.Fields.PhoneNumbers]
          });

          if (data.length > 0) {
            contacts = data;
          }
        }

        if(messageWithoutCommand) {
          const contact = contacts.filter(el => el.name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').includes(messageWithoutCommand));
          if(contact.length !== 0) {
            const contactNumber = contact[0].phoneNumbers[0].number;
            setTimeout(() => Linking.openURL(`tel:${contactNumber}`),2000);
            response = `Calling ${contact[0].name}`;
          }else {
            response = "Sorry couldn't find the contact";
          }
          
        }

      } else {

        const resultFromDuckDuckGo = await getResponseFromDuckDuckGo(messageLowered);
        if (resultFromDuckDuckGo !== '') {
          response = resultFromDuckDuckGo;
        } else {
          const resultFromOpenAI = await getResponseFromOpenAI(messageLowered);
          response = resultFromOpenAI;
          // response = "Sorry that command isn't supported yet";
        }

      }

      setTimeout(() => {
        addResponse(response, 'bot');
        if (response.length > 200) {
          Speech.speak("Here is what I found!");
        } else {
          Speech.speak(response);
        }
        setIsBusy(false);
      }, 2000)


    }

  }

  return (
    <KeyboardAvoidingView className='dark:bg-zinc-900 h-full ' behavior='padding'  >
      <View className='w-5/6 mx-auto mt-10  '>

        <ModalMessage show={modalData.show} setModal={setModalData} url={modalData.url} />

        <View className="flex-row items-center justify-between">
          <Image
            source={Logo}
            className="w-14 h-20"
          />
          <TouchableOpacity
            onPress={()=> navigation.navigate("profile") }
          >
            <Ionicons
              name="settings-outline"
              size={30}
              color="#7c3aed"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="h-3/5 mb-4"
          contentContainerStyle={{
            padding: 25,
          }}
          ref={scrollViewRef}
          onContentSizeChange={() => { scrollViewRef.current?.scrollToEnd() }}
          showsVerticalScrollIndicator={false}
        >
          {chatList.map((el, idx) => addMessage(el.type, el.text, el.mt, idx))}

        </ScrollView>

        <View className='flex-row justify-center items-center  rounded-full border-2 p-3 border-gray-300 mb-4'>
          <TextInput
            value={message}
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
              name='arrow-up'
              size={28}
              color='white'
            />
          </TouchableOpacity>
        </View>

        <View className='w-full'>
          {!voiceData.started ?
            (

              <TouchableOpacity
                className='bg-violet-600 rounded-full p-2 self-start mx-auto'
                onPress={startRecognizing}

              >
                <Ionicons
                  name="mic-outline"
                  size={32}
                  color='white'
                />

              </TouchableOpacity>
            )
            :
            (
              <TouchableOpacity
                className='bg-violet-600 rounded-full p-2 self-start mx-auto'
                onPress={stopRecognizing}

              >
                <Ionicons
                  name="stop"
                  size={32}
                  color='white'
                />

              </TouchableOpacity>
            )}
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default VoiceAssistantScreen