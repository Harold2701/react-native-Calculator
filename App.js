import Home from "./src/screens/home"
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Platform, SafeAreaView, StyleSheet, StatusBar } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="auto" />
      <Home/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0
  }
})

