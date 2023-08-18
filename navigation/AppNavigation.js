import { NavigationContainer } from "@react-navigation/native";
import {
  LoginScreen,
  ProfileScreen,
  SplashScreen,
  StartScreen,
  VoiceAssistantScreen,
} from "../screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";

const Stack = createNativeStackNavigator();
const AppNavigation = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [userInfo] = useContext(UserContext);
  useEffect(() => {
    setTimeout(() => setShowSplashScreen(false), 4000);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        { showSplashScreen ? <Stack.Screen name="Splash" component={SplashScreen} /> : null }

        { userInfo ? null : <Stack.Screen name="Start" component={StartScreen} /> }
        { userInfo ? null : <Stack.Screen name="Login" component={LoginScreen} /> }
        { userInfo ? <Stack.Screen name="main" component={VoiceAssistantScreen} /> : null}
        { userInfo ? <Stack.Screen name="profile" component={ProfileScreen} /> : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
