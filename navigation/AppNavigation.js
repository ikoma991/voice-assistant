import { NavigationContainer } from "@react-navigation/native";
import { LoginScreen, StartScreen, VoiceAssistantScreen } from "../screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="main" component={VoiceAssistantScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
