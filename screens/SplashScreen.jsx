import { Text, View, Image } from "react-native";
import Logo from "../assets/logo.png";

const SplashScreen = () => {
  return (
    <View className="dark:bg-zinc-900">
      <View className="h-full items-center w-80 mx-auto">
        <Image
          source={Logo}
          // className="w-full h-full"
          className="mt-44 h-72 w-64 "
        />
        <Text className="text-6xl -mt-10 font-bold text-violet-600 mb-2">
          every.
        </Text>
        <Text className="text-bold text-lg mb-20 dark:text-gray-200">
          Your everyday personal assistant
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;
