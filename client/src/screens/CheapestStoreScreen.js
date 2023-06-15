import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Card, Image, Button, Icon } from "react-native-elements";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./../api/baseUrl.js";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const CheapestStoreScreen = ({ navigation }) => {
  const route = useRoute();
  const { listData } = route.params;
  const [isLoading, setisLoading] = useState(true);
  const [userLocation, setUserLocation] = useState("");
  // const [cheapestStore, setCheapestStore] = useState({
  //   store: { name: "", locations: {} },
  //   sum: 0,
  //   products: [],
  // });
  const [storesVariants, setStoresVariants] = useState([
    { store: { name: "", locations: {} }, sum: 0, products: [] },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
          //magazina ima produkti v masivi, koito matchvat opredlen regex,
          productsArray.sort((a, b) => a.price - b.price);
          const lowestPriceObject = productsArray[0]; //ot tqh se izbira nai-evtiniq
          lowest.lowestPriceProducts.push(lowestPriceObject);
        }
        lowestPricesForStores.push(lowest); //masiv s nai-evitinite produkti za edin magaizn
      }
      let storesWithSumPrice = [];
      for (const store of lowestPricesForStores) {
        //sumirat se cenite na produktite za vseki magazin i se izbira nai-evtinata
        const sum = store.lowestPriceProducts
          .reduce((total, obj) => total + obj.price, 0)
          .toFixed(2);
        storesWithSumPrice.push({
          store: store.store,
          sum: sum,
          products: store.lowestPriceProducts,
        });
      }

      storesWithSumPrice.sort((a, b) => {
        if (a.products.length !== b.products.length) {
          return a.products.length - b.products.length;
        }
        return a.sum - b.sum;
      });

      // const lowestPriceStore = storesWithSumPrice[0];

      // setCheapestStore(lowestPriceStore);

      setStoresVariants(storesWithSumPrice);
      setisLoading(false);
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

  const getNextStore = () => {
    if (storesVariants[currentIndex + 1]) {
      setCurrentIndex((currentIndex) => currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };
  const getPreviousStore = () => {
    if (storesVariants[currentIndex - 1]) {
      setCurrentIndex((currentIndex) => currentIndex - 1);
    } else {
      setCurrentIndex(storesVariants.length - 1);
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
  const content = (
    <ScrollView>
      <Card>
        <View style={styles.storeContainer}>
          {storesVariants.length > 1 ? (
            <Button
              icon={
                <AntDesign
                  name="arrowleft"
                  size={18}
                  color="black"
                  style={{ color: "#737373" }}
                />
              }
              buttonStyle={{
                backgroundColor: "white",
                width: 40,
                height: 30,
                marginTop: 3,
              }}
              onPress={() => getPreviousStore()}
            />
          ) : null}
          {currentIndex == 0 ? (
            <Ionicons
              name="pricetag-outline"
              size={24}
              color="green"
              marginTop={10}
              marginRight={5}
            />
          ) : null}

          <Text style={styles.storeName}>
            {storesVariants[currentIndex].store.name}
          </Text>
          {storesVariants.length > 1 ? (
            <Button
              icon={
                <AntDesign
                  name="arrowright"
                  size={18}
                  color="black"
                  style={{ color: "#737373" }}
                />
              }
              buttonStyle={{
                backgroundColor: "white",
                width: 40,
                height: 30,
                marginTop: 3,
              }}
              onPress={() => getNextStore()}
            />
          ) : null}
        </View>
        <Text style={styles.infoText}>
          Продукти от списъка:{" "}
          <Text style={styles.infoValue}>{listData.length}</Text>
        </Text>
        <Text style={styles.infoText}>
          Намерени продукти:{" "}
          <Text style={styles.infoValue}>
            {storesVariants[currentIndex].products.length}
          </Text>
        </Text>
        <Text style={styles.infoText}>
          Обща цена за продуктите:{" "}
          <Text style={styles.infoValue}>
            {storesVariants[currentIndex].sum} лв
          </Text>
        </Text>
      </Card>
      <View style={styles.productContainer}>
        {storesVariants[currentIndex].products.map((product, index) => (
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

  return isLoading ? (
    <ActivityIndicator size="large" style={styles.activityIndicator} />
  ) : (
    content
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
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CheapestStoreScreen;
