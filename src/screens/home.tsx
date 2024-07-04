import { StatusBar } from 'expo-status-bar';
import { useState, useRef } from 'react'
import { StyleSheet, View, Text, Dimensions, Animated } from 'react-native';
import Button from '../components/Button';

const scaleFactor = Dimensions.get("screen").scale
let closeBracket = false

export default function Home() {
  const [current, setCurrent] = useState("0")
  const [isError, setIsError] = useState(false)
  
  const lastChar = current[current.length-1]
  const layout = [
    "⌫", "( )", "%", "÷",
    "1", "2", "3", "×",
    "4", "5", "6", "-",
    "7", "8", "9", "+",
    "0", ".", "="
  ] 
  let result = isError ? "Error" : ""

  const resultText = useRef(null)
  const inputText = useRef(null)
  const targetPos = useRef(null)
  const initialPos = useRef(null)
  const isAnimating = useRef(false)
  
  const resultVisibilty = useRef(new Animated.Value(1)).current
  const positionAnim = useRef(new Animated.ValueXY({x:0, y:0})).current
  const sizeAnim = useRef(new Animated.Value(30)).current
  const errorColorAnim = useRef(new Animated.Value(1)).current

  const color = sizeAnim.interpolate({
    inputRange: [30, 75],
    outputRange: ["rgb(100, 100, 100)", "rgb(0, 0, 0)"]
  })
  
  const opacity = sizeAnim.interpolate({
    inputRange: [30, 42.8571428575],
    outputRange: [.7, 1],
  })

  const errorColor = errorColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgb(255, 0, 0)", "rgb(100, 100, 100)"]
  })

  const animate = async () => {
    let result

    try {result = eval(current.replaceAll("×", "*").replaceAll("÷", "/")).toString()} 
    catch {
      setIsError(true)
      errorColorAnim.setValue(0)
      Animated.timing(errorColorAnim, {
        toValue: 1,
        useNativeDriver: false,
        duration: 300
      }).start()
      return
    }

    positionAnim.setValue({x: (initialPos.current.x - targetPos.current.x), y: (initialPos.current.y - targetPos.current.y)})
    sizeAnim.setValue(30)
    setCurrent(result)

    setTimeout(() => {
      isAnimating.current = true

      Animated.parallel([
        Animated.timing(positionAnim, {
          toValue: {x: 0, y: 0},
          useNativeDriver: true,
          duration: 200
        }),
  
        Animated.timing(sizeAnim, {
          toValue: result.length > 8 ? 60 : 75,
          useNativeDriver: false,
          duration: 200
        }),
      ]).start()

      setTimeout(() => {
        isAnimating.current = false
      }, 200)
    })

    resultVisibilty.setValue(0)
  }
  
  const functions = {
    "⌫": () => { 
      if ((lastChar == ")" || lastChar == "(") && current[current.length-2] != "(" && current[current.length-2] != ")") {closeBracket = !closeBracket}
      sizeAnim.setValue(current.length-1 > 9 ? 60 : 75);
      (current.length != 1) ? setCurrent(current.substring(0,current.length-1)) : setCurrent("0")
    },

    "( )": () => {
      sizeAnim.setValue(current.length+1 > 9 ? 60 : 75);

      if (lastChar == "(" || lastChar == ")") {
        setCurrent((current != "0" ? current : "")+lastChar)
      } else {
        setCurrent((current != "0" ? current : "") + (closeBracket ? ")" : "("))
        closeBracket = !closeBracket
      }
    },

    "=": () => {
      animate()
    }
  }

  const inputOnLayout = () => {
    if (targetPos.current == null) {
      inputText.current.measure((x, y, w, h, px, py) => {
        targetPos.current = {x:px, y:py}
        sizeAnim.setValue(75)
        setCurrent("0")
      })
    }
  }

  const resultOnLayout = () => {
    if (initialPos.current == null) {
      resultText.current.measure((x, y, w, h, px, py) => {
        initialPos.current = {x:px, y:py}
      })
    }
  }

  const onClick = (item) => {
    if (isAnimating.current) return
    if (isError) setIsError(false)

    resultVisibilty.setValue(1)

    if (functions[item]) {
      functions[item]()
    } else {
      sizeAnim.setValue(current.length+1 > 9 ? 60 : 75)
      setCurrent((current != "0" || !(Number(item) || item == "0")) ? (current + item) : item)
    }
  }

  try {
    let c = (Number(lastChar) || lastChar == "0" || lastChar == ")" || lastChar == "(") ? current : current.substring(0, current.length-1)
    result = eval(c.replaceAll("×", "*").replaceAll("÷", "/"))
  } catch {}

  return (
    <View style = {styles.container}>
      <Animated.View 
        style = {[styles.inputContainer, {
          transform: [
            {translateX: positionAnim.x},
            {translateY: positionAnim.y},
          ],
        }]}
        ref = {inputText}
      >
        <Animated.Text 
          onLayout={inputOnLayout}
          style = {[styles.input, {
            fontSize: sizeAnim,
            color: color,
            opacity: opacity
          }]}
        >{current} </Animated.Text>
      </Animated.View>

      <Animated.Text style = {[styles.result, {opacity: resultVisibilty, color: errorColor}]} ref = {resultText} onLayout={resultOnLayout}>{result} </Animated.Text>
      <View style = {styles.keypad}>
        {layout.map(item => <Button text = {item.toString()} onPress={onClick} key={item}/>)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end"
  },

  inputContainer: {
    alignSelf: "flex-end",
    marginRight: 3,
  },

  input: { 
    alignSelf: "flex-end",
    fontSize: 75,
    fontWeight: "300"
  },

  result: {
    fontSize: 30,
    alignSelf: "flex-end",
    marginRight: 15,
    marginBottom: 25,
    marginTop: 10,
    fontWeight: "300",
    color: "rgb(100,100,100)"
  },

  keypad: {
    justifyContent: "center",
    flexWrap: "wrap",
    flexDirection: "row",
    marginBottom: 30
  },
});