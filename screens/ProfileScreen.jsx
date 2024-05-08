import { Text, View, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useContext(UserContext);
  const handleLogout = () => {
    AsyncStorage.removeItem("@user");
    setUserInfo(undefined);
  };
  return (
    <View className="dark:bg-zinc-900">
      <View className="h-full items-center w-80 mx-auto">
        <Image
          source={{ uri: userInfo.picture.replace("s96-c", "s400-c") }}
          // className="w-full h-full"
          className="mt-44 h-56 w-56 rounded-full"
        />
        {/* <Text className="text-6xl mt-10 font-bold text-violet-600 mb-2">every.</Text> */}
        <Text className="text-bold text-2xl mt-10 mb-10 dark:text-gray-200">
          {userInfo.name}
        </Text>
        <TouchableOpacity
          className="bg-violet-600 p-4 w-full rounded-full"
          onPress={handleLogout}
        >
          <Text className="text-white text-xl text-center font-bold">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
