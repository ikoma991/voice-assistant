// 575242849231-mo97mvq9sh7h6s65ldldn30r1jols7hk.apps.googleusercontent.com
import { View, Text, Image, TouchableOpacity } from 'react-native'
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoogleIcon from "../assets/google-icon.png";
import FacebookIcon from '../assets/facebook-icon.png';
import { useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';

const LoginScreen = () => {
  const [userInfo,setUserInfo] = useContext(UserContext);
  const [request,response,promptAsync] = Google.useAuthRequest({
    androidClientId: "575242849231-mo97mvq9sh7h6s65ldldn30r1jols7hk.apps.googleusercontent.com"
  })
 
  useEffect(()=>{
    handleSignInWithGoogle();
  },[response]);


  const handleSignInWithGoogle = async () => {
    const user = await AsyncStorage.getItem("@user");
    if(!user){
      if(response?.type === "success") {
        await getUserInfo(response.authentication.accessToken);
      }
      
    }else {
        setUserInfo(JSON.parse(user));
    }
  }
  
  const getUserInfo = async (token) => {
    if(!token) return;
    try{
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    }catch (err) {
      console.log("Getting User Info",err);
    }
  }

  const handleButton = () => {
      promptAsync();
    // navigation.navigate("main");
  }


  return (
   <View className="dark:bg-zinc-900">

   
      <View className="h-full items-center w-80 mx-auto marker mt-28">
        <Text className="text-4xl font-bold mb-24 dark:text-white">Sign Up</Text>

        <TouchableOpacity  
          className="bg-white dark:bg-gray-700 p-4 w-full rounded-full mb-4 flex-row items-center space-x-8"
          onPress={handleButton}
        >
          <View className="h-7 w-7 ml-3">
            <Image source={GoogleIcon} className="w-full h-full"/>
          </View>

            <Text className="text-black dark:text-white text-xl font-bold">
                Sign In With Google
            </Text>
            
        </TouchableOpacity>

        {/* <TouchableOpacity 
          className="bg-white dark:bg-gray-700 p-4 w-full rounded-full flex-row items-center space-x-8 "
          onPress={moveToNextScreen} 
        >
          <View className="h-7 w-7 ml-3">
            <Image source={FacebookIcon} className="w-full h-full"/>
          </View>

          <Text className="text-black dark:text-white text-xl font-bold">
              Sign In With Facebook
          </Text>
      
        </TouchableOpacity> */}

      </View>

    </View>

  )
}

export default LoginScreen