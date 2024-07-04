import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';

const size = Dimensions.get("screen").width / 4.91 // 4.95

export default function Button({text, onPress} : {text: string, onPress: (item) => void}) {
  const pressed = () => {
    onPress(text)
  }

  return (
    <TouchableOpacity style={[styles.button, text == "0" && styles.zero]} onPress={pressed}>
      <Text style={[styles.text, (!Number(text) && text != "0" && text != ".") && styles.colored, (["÷", "×", "-", "+", "="]).indexOf(text) != -1 && {fontSize: 40, fontWeight: "500"}, text == "-" && {fontSize: 50}]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "rgb(230,230,230)",
    width: size, 
    height: size,
    justifyContent: "center",
    alignItems: "center",
    margin: 6.2,
    borderRadius: 100,
  },

  zero: {
    width: size*2 + (7*2)
  },

  colored: {
    color: "rgb(150,150,0)"
  },

  text: {
    fontSize: 35
  }
})