import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { SearchBar, Card, Button, Text, Image } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "./../api/baseUrl.js";

const SearchScreen = () => {
  const navigation = useNavigation();

  const [search, setSearch] = useState("");
  const [productsToShow, setProductsToShow] = useState([]);
  const [userLocation, setUserLocation] = useState("");
  const [noResultFlag, setNoResultFlag] = useState(false);

  const searchTerm = async () => {
    if (search) {
      try {
        const response = await api.post("/api/main/searchProduct", {
          searchTerm: search,
          userLocationCity: userLocation,
        });
        if (response.data.length == 0) {
          setNoResultFlag(true);
        } else {
          setNoResultFlag(false);
        }
        setProductsToShow(response.data);
      } catch (err) {
        // setErrorMessage("Something get wrong");
        console.log(err)
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
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

      getUserLocation();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SearchBar
        placeholder="Търси..."
        onChangeText={(searchText) => setSearch(searchText)}
        value={search}
        onEndEditing={searchTerm}
      />
      {productsToShow.length == 0 && setNoResultFlag == false ? (
        <View>
          <FontAwesome
            name="search"
            size={200}
            color="#d9d9d9"
            alignSelf="center"
            marginTop={130}
          />
          <Text style={{ margin: 20, alignSelf: "center", color: "#a6a6a6" }}>
            Потърсете продукт като въведете неговото име...
          </Text>
        </View>
      ) : null}
      {noResultFlag == true ? (
        <View>
          <FontAwesome
            name="search"
            size={200}
            color="#d9d9d9"
            alignSelf="center"
            marginTop={130}
          />
          <Text style={{ margin: 20, alignSelf: "center", color: "#a6a6a6" }}>
            Няма намерени резултати...
          </Text>
        </View>
      ) : null}

      {productsToShow.map((product, index) => (
        <Card key={index} style={styles.card}>
          <View style={styles.cardInfo}>
            <Entypo name="shop" size={28} color="#52525C" marginTop={2} />

            <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 3 }}>
              {product.store.name}
            </Text>
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
          <Image
            source={{ uri: product.imageUrl }}
            style={{ width: "100%", height: 200, resizeMode: "contain" }}
          />

          <View
            style={{
              marginTop: 20,
              marginBottom: 10,
              backgroundColor: "#80aaff",
              borderRadius: 25,
            }}
          >
            <Text style={{ fontSize: 20, alignSelf: "center", color: "white" }}>
              {product.price} лв
            </Text>
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 15, alignSelf: "center" }}>
              {product.title}
            </Text>
          </View>

          <Button
            buttonStyle={styles.buttonStyle}
            title="ВИЖ ПРОДУКТА"
            onPress={() =>
              navigation.navigate("ProductDetailScreen", { product: product })
            }
          />
        </Card>
      ))}
    </ScrollView>
  );
};

SearchScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 20,
  },
  buttonStyle: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    backgroundColor: "rgba(0, 153, 51,0.4)",
  },
  cardInfo: { flexDirection: "row", marginBottom: 30, marginTop: 10 },
});

export default SearchScreen;
