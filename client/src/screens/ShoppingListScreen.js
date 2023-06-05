import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Input, Card, Button, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { Fontisto } from "@expo/vector-icons";
const ShoppingListScreen = () => {
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState("");
  const [listData, setListData] = useState([]);
  const [userLocation, setUserLocation] = useState("");

  const handleAddToList = () => {
    if (inputValue.trim() !== "") {
      setListData((prevList) => [...prevList, inputValue]);
      setInputValue("");
    }
  };

  const handleDeleteItem = (index) => {
    setListData((prevList) => {
      const updatedList = [...prevList];
      updatedList.splice(index, 1);
      return updatedList;
    });
  };

  const renderListItem = (item, index) => (
    <Card key={index}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text>{item}</Text>
        <Button
          icon={<Icon name="delete" color="white" width={30} height={25} />}
          buttonStyle={{ backgroundColor: "#ff8080", width: 30, height: 30 }}
          onPress={() => handleDeleteItem(index)}
        />
      </View>
    </Card>
  );

  return (
    <View contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Input
          label="Продукт"
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button
          title="Добави"
          onPress={handleAddToList}
          buttonStyle={{ backgroundColor: "rgba(0, 153, 51,0.4)" }}
        />
      </Card>
      <ScrollView style={styles.listContainer}>
        <View style={styles.list}>
          {listData.length === 0 ? (
            <Fontisto
              name="shopping-basket-add"
              size={200}
              color="#d9d9d9"
              alignSelf="center"
              marginTop={70}
            />
          ) : null}
          {listData.map((item, index) => renderListItem(item, index))}
        </View>
      </ScrollView>

      <View style={styles.buttonView}>
        {listData.length > 0 ? (
          <Button
            title="Намери най-изгоден магазин"
            onPress={() =>
              navigation.navigate("CheapestStoreScreen", {
                listData,
              })
            }
            buttonStyle={{
              backgroundColor: "#80aaff",
              width: "80%",
              alignSelf: "center",
              marginTop: 20,
            }}
          />
        ) : null}
      </View>
    </View>
  );
};

ShoppingListScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    height: 400,
    marginTop: 10, // Set a fixed height or adjust as needed
  },
  list: {
    flex: 1,
    marginTop: 10,
  },
});

export default ShoppingListScreen;
