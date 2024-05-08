import { View } from 'react-native'
import { WebView } from 'react-native-webview';

const GoogleMessage = ({query,mt}) => {
  return (
    <View
      pointerEvents="none"
      style={{
        marginVertical: 5,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:20
      }}>
        <View
          style={{
            height: 400,
            borderRadius: 20,
            width: '100%',
            overflow: 'hidden'
          }}>  
          <WebView
            source={{
              uri: encodeURI(`https://www.google.com/search?hl=en&q=${query}`),
            }}
            style={{
              marginTop: mt || -150,
              height: 400,
              opacity:0.99
            }}
          />
      </View>
    </View>
  )
}

export default GoogleMessage