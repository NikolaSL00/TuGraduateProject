import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Card } from "react-native-elements";
import Spacer from "../components/Spacer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const ProductRecognizerMiddleScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* <Button title='Търси по име на продукта' onPress={() => navigation.navigate('SearchScreen')}/>
            <Spacer/>
            <Spacer/> */}
      <Card>
        <MaterialCommunityIcons
          name="food-croissant"
          size={200}
          color="#ffefcc"
          alignSelf="center"
        />

        <Button
          title="Пакетирана храна"
          onPress={() => navigation.navigate("BarcodeScannerScreen")}
          buttonStyle={styles.buttonStyle}
        />
      </Card>
      <Card>
        <MaterialCommunityIcons
          name="food-apple"
          size={200}
          color="#ffcccc"
          alignSelf="center"
        />

        <Button
          title="Плодове и зеленчуци"
          onPress={() => navigation.navigate("TakeImageScreen")}
          buttonStyle={styles.buttonStyle}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: "white",
    // borderColor: 'black',
    // borderWidth: 10,
  },
  buttonStyle: {
    backgroundColor: "#80aaff",
    marginTop: 10,
    width: 320,
    alignSelf: "center",
  },
});

export default ProductRecognizerMiddleScreen;
