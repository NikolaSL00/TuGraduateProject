import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { SearchBar, Card, Button, Text, Image } from "react-native-elements";
import { products } from "../helpers/exampleData";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SearchScreen = () => {
  const navigation = useNavigation();

  const [search, setSearch] = useState("");
  const [productsToShow, setProductsToShow] = useState([]);
  const [userLocation, setUserLocation] = useState("");

  const searchTerm = () => {
    const searchTerms = search
      .split(" ")
      .map((term) => `(?=.*${term})`)
      .join("");
    const regex = new RegExp(searchTerms, "i");
    const searchResults = products.filter((item) => regex.test(item.title));

    const filterProductsByCity = searchResults.filter((product) => {
      const locations = product.store.locations;
      return locations.some((location) => location.city === userLocation);
    });
    const sortedProdcutsByPrice = filterProductsByCity.sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      return priceA - priceB;
    });

    setProductsToShow(sortedProdcutsByPrice);
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

          <View style={styles.cardInfo}>
            <MaterialIcons
              name="attach-money"
              size={28}
              color="#52525C"
              marginTop={2}
            />
            <Text style={{ fontSize: 20 }}>{product.price}</Text>
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
  cardInfo: { flexDirection: "row", marginBottom: 10, marginTop: 10 },
});

export default SearchScreen;
