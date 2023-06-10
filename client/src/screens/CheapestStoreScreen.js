import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Card, Image } from "react-native-elements";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./../api/baseUrl.js";
import { Ionicons } from "@expo/vector-icons";

const CheapestStoreScreen = ({ navigation }) => {
  const route = useRoute();
  const { listData } = route.params;
  const [userLocation, setUserLocation] = useState("");
  const [cheapestStore, setCheapestStore] = useState({
    store: { name: "", locations: {} },
    sum: 0,
    products: [],
  });

  const findCheapestStore = async () => {
    try {
      const response = await api.post("/api/main/searchList", {
        userLocationCity: userLocation,
        listData,
      });

      const stores = response.data;
      let lowestPricesForStores = [];
      for (const store of stores) {
        let lowest = { store: store.store, lowestPriceProducts: [] };
        for (const productsArray of store.products) {
          productsArray.sort((a, b) => a.price - b.price);
          const lowestPriceObject = productsArray[0];
          lowest.lowestPriceProducts.push(lowestPriceObject);
        }
        lowestPricesForStores.push(lowest);
      }
      let sumsForStores = [];
      for (const store of lowestPricesForStores) {
        const sum = store.lowestPriceProducts.reduce(
          (total, obj) => total + obj.price,
          0
        );
        sumsForStores.push({
          store: store.store,
          sum: sum,
          products: store.lowestPriceProducts,
        });
      }

      sumsForStores.sort((a, b) => a.sum - b.sum);
      const lowestPriceStore = sumsForStores[0];
      setCheapestStore(lowestPriceStore);
    } catch (err) {
      // setErrorMessage("Something get wrong");
      console.log(err.response.data.errors[0].message);
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
      if (userLocation && listData) {
        findCheapestStore();
      }
    }, [userLocation])
  );

  return (
    <ScrollView>
      <Card>
        <Text style={styles.title}>Най-изгодни цени</Text>
        <View style={styles.storeContainer}>
          <Ionicons
            name="pricetag-outline"
            size={24}
            color="green"
            marginTop={10}
            marginRight={5}
          />
          <Text style={styles.storeName}>{cheapestStore.store.name}</Text>
        </View>

        <Text style={styles.infoText}>
          Обща цена за продуктите:{" "}
          <Text style={styles.infoValue}>{cheapestStore.sum} лв</Text>
        </Text>
        <Text style={styles.infoText}>
          Намерени продукти от списъка:{" "}
          <Text style={styles.infoValue}>{cheapestStore.products.length}</Text>
        </Text>
      </Card>
      <View style={styles.productContainer}>
        {cheapestStore.products.map((product, index) => (
          <Card key={index} style={styles.card}>
            <View style={styles.cardInfo}>
              {product.isPhysical ? (
                <FontAwesome
                  name="map-marker"
                  size={24}
                  color="rgba(0, 153, 51,0.7)"
                  marginLeft={5}
                  marginTop={3}
                />
              ) : null}
            </View>
            <Image source={{ uri: product.imageUrl }} style={styles.image} />

            <View style={styles.priceContainer}>
              <Text style={styles.price}>{product.price} лв</Text>
            </View>
            <View style={styles.productInfoContainer}>
              <Text style={styles.productTitle}>{product.title}</Text>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

CheapestStoreScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    color: "#737373",
    fontWeight: "bold",
    alignSelf: "center",
  },
  storeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  storeName: {
    fontSize: 24,
    color: "#737373",
  },
  infoText: {
    fontSize: 16,
    color: "#737373",
    marginTop: 15,
  },
  infoValue: {
    fontWeight: "bold",
    color: "rgba(0, 153, 51,0.5)",
  },
  productContainer: {
    marginBottom: 20,
  },

  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  priceContainer: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: "#80aaff",
    borderRadius: 25,
  },
  price: {
    fontSize: 20,
    alignSelf: "center",
    color: "white",
  },
  productInfoContainer: {
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 15,
    alignSelf: "center",
  },
});

export default CheapestStoreScreen;
