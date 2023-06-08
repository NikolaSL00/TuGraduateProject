import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Input, Card, Button, Icon } from "react-native-elements";
import { Entypo } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { products } from "../helpers/exampleData";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CheapestStoreScreen = ({ navigation }) => {
  const route = useRoute();
  const { listData } = route.params;
  const [userLocation, setUserLocation] = useState("");

  const findCheapestStore = async () => {
    let filteredProducts = [];
    for (let searchItem of listData) {
      const searchTerms = searchItem
        .split(" ")
        .map((term) => `(?=.*${term})`)
        .join("");
      const regex = new RegExp(searchTerms, "i");
      const searchResults = products.filter((item) => regex.test(item.title));

      filteredProducts = searchResults.filter((product) => {
        const locations = product.store.locations;
        return locations.some((location) => location.city === userLocation);
      });
    }
    let stores = [];
    for (let element of filteredProducts) {
      if (!stores.includes(element.store)) {
        stores.push(element.store);
      }
    }

    for (let element of filteredProducts) {
    }
  };

  const getUserLocation = async () => {
    try {
      const userLocationCityFromStorage = await AsyncStorage.getItem(
        "userLocationCity"
      );

      if (userLocationCityFromStorage) {
        setUserLocation(userLocationCityFromStorage);
      }
    } catch (error) {
      console.log("Грешка", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserLocation();
    }, [])
  );
  useFocusEffect(
    React.useCallback(() => {
      findCheapestStore();
    }, [userLocation])
  );

  return (
    <View>
      <Text>CheapestStore</Text>
    </View>
  );
};

CheapestStoreScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({});

export default CheapestStoreScreen;
