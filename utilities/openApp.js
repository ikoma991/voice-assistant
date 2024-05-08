import * as Linking from "expo-linking";
import { Platform } from "react-native";

export const openApp = async (appName) => {
  const appNameFormatted = appName.replace(" ", "-");
  console.log("Formatted appname : ", appNameFormatted);
  const contacts = ["contact", "contacts", "phone-book", "phone"];
  const message = ["message", "sms", "messenger", "messages"];
  const maps = ["maps", "map", "google-maps", "maps-app"];
  try {
    if (appNameFormatted === "facebook-messenger") {
      await Linking.openURL(`fb-messenger://`);
    } else if (contacts.includes(appNameFormatted)) {
      console.log("CONTACTS...");
      // Linking.openURL("content://com.android.contacts/contacts");
      Linking.openURL("tel:");
    } else if (message.includes(appNameFormatted)) {
      //   Linking.openURL("sms://+923463886508?body=Hello");
      Linking.openURL("sms:");
    } else if (appNameFormatted === "settings") {
      //   Linking.openSettings();
      if (Platform.OS === "android") {
        Linking.sendIntent("android.settings.SETTINGS");
      } else {
        Linking.openURL("app-settings:");
      }
    } else if (maps.includes(appNameFormatted)) {
      Linking.openURL("geo:");
      // Linking.openURL("geo:0,0?q=Karachi+Pakistan");
      // Linking.openURL("google.navigation:q=Hilal+e+ahmer+Hospital,+Hyderabad+Pakistan");
    } else if (appNameFormatted === "twitter") {
      Linking.openURL("twitter://timeline");
    } else {
      await Linking.openURL(`${appNameFormatted}://`);
    }
  } catch (err) {
    Linking.openURL(`https://${appNameFormatted}.com`);
  }
};
