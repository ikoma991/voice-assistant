import { useColorScheme } from "nativewind";
import { useEffect, useLayoutEffect } from "react";
import { StyleSheet, Platform, StatusBar, SafeAreaView } from "react-native";
import AppNavigation from "./navigation/AppNavigation";

export default function App() {
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    if (colorScheme === "dark") {
      StatusBar.setBarStyle("light-content", true);
    } else {
      StatusBar.setBarStyle("dark-content", true);
    }
  }, [colorScheme]);

  return (
    <SafeAreaView
      style={styles.AndroidSafeArea}
      className="bg-bgLight dark:bg-zinc-900 "
    >
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
