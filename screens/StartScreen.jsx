import { Text, View,Image, TouchableOpacity } from "react-native";

import {useNavigation} from '@react-navigation/native'
import Logo from "../assets/logo.png" 

const StartScreen = () => {
  const navivation = useNavigation();
  const moveToNextScreen = ()=> {
    navivation.navigate("Login")
  }
    return (
    <View className="dark:bg-zinc-900">

      
      <View className="h-full items-center w-80 mx-auto">
          <Image
            source={Logo}
            // className="w-full h-full"
            className="my-6 h-64 w-48 "
          />
        <Text className="text-6xl font-bold text-violet-600 mb-2">every.</Text>
        <Text className="text-bold text-lg mb-20 dark:text-gray-200">Your everyday personal assistant</Text>

        <TouchableOpacity  
          className="bg-violet-600 p-4 w-full rounded-full"
          onPress={moveToNextScreen}
        >
          <Text className="text-white text-xl text-center font-bold">Login</Text>
        </TouchableOpacity>

      </View>
    </View>
    );
}

export default StartScreen;