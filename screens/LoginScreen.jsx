import { View, Text, Image, TouchableOpacity } from 'react-native'
import GoogleIcon from "../assets/google-icon.png";
import FacebookIcon from '../assets/facebook-icon.png';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

  const moveToNextScreen = () => {
    navigation.navigate("main");
  }


  return (
   <View className="dark:bg-zinc-900">

   
      <View className="h-full items-center w-80 mx-auto marker mt-28">
        <Text className="text-4xl font-bold mb-24 dark:text-white">Sign Up</Text>

        <TouchableOpacity  
          className="bg-white dark:bg-gray-700 p-4 w-full rounded-full mb-4 flex-row items-center space-x-8"
          onPress={moveToNextScreen}
        >
          <View className="h-7 w-7 ml-3">
            <Image source={GoogleIcon} className="w-full h-full"/>
          </View>

            <Text className="text-black dark:text-white text-xl font-bold">
                Sign In With Google
            </Text>
            
        </TouchableOpacity>

        <TouchableOpacity 
          className="bg-white dark:bg-gray-700 p-4 w-full rounded-full flex-row items-center space-x-8 "
          onPress={moveToNextScreen} 
        >
          <View className="h-7 w-7 ml-3">
            <Image source={FacebookIcon} className="w-full h-full"/>
          </View>

          <Text className="text-black dark:text-white text-xl font-bold">
              Sign In With Facebook
          </Text>
      
        </TouchableOpacity>

      </View>

    </View>

  )
}

export default LoginScreen