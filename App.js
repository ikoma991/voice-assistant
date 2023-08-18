import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { StyleSheet, Platform, SafeAreaView } from "react-native";
import AppNavigation from "./navigation/AppNavigation";
import { UserContext } from "./context/userContext"
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const { colorScheme } = useColorScheme();
  const [ userInfo, setUserInfo] = useState(undefined);

  const getUserInfo = async () => {
    const savedUser = await AsyncStorage.getItem("@user");
    if(savedUser) {
      setUserInfo(JSON.parse(savedUser));
    }
  }

  useEffect(()=>{
    getUserInfo();
  },[])

  return (
    <SafeAreaView
      style={styles.AndroidSafeArea}
      className="bg-bgLight dark:bg-zinc-900 "
    >
      <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
      <UserContext.Provider value={ [userInfo,setUserInfo] }>
        <AppNavigation />
      </UserContext.Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    // backgroundColor: "white",
    // backgroundColor: "#FAFBFD",
    // backgroundColor: "#f0f3f9",
    // backgroundColor: "#eaeef6",
    // backgroundColor: "#E5E5E5",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
