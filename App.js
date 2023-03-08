import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { StyleSheet, Platform, SafeAreaView } from "react-native";
import AppNavigation from "./navigation/AppNavigation";

export default function App() {
  const { colorScheme } = useColorScheme();
  return (
    <SafeAreaView
      style={styles.AndroidSafeArea}
      className="bg-bgLight dark:bg-zinc-900 "
    >
      <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
      <AppNavigation />
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
