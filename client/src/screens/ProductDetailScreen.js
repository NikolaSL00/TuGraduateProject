import { View, StyleSheet } from "react-native";
import { Card, Button, Text, Image, Icon } from "react-native-elements";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Linking } from "react-native";

const openURL = async (url) => {
  try {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open URL: " + url);
    }
  } catch (error) {
    console.log("Error occurred while opening URL: " + error);
  }
};

const ProductDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { product } = route.params;
  console.log("product", product.productUrl);
  console.log("store", product.store.name);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.cartIconStyle}>
          <MaterialCommunityIcons
            name="cart-plus"
            size={32}
            color="rgba(0, 153, 51,0.4)"
          />
        </View>
        <Image
          source={{ uri: product.imageUrl }}
          style={{ width: "100%", height: 200, resizeMode: "contain" }}
        />
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              margin: 3,
              textAlign: "center",
            }}
          >
            {product.title}
          </Text>
        </View>
        {product.description ? (
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 3,
                color: "#858593",
              }}
            >
              {product.description}
            </Text>
          </View>
        ) : null}

        <View style={styles.cardInfo}>
          {/* <MaterialIcons
            name="attach-money"
            size={28}
            color="#52525C"
            marginTop={2}
          /> */}
          <Text style={{ fontSize: 20, marginLeft: 2 }}>
            {product.price} лв
          </Text>
          <MaterialIcons
            name="food-bank"
            size={24}
            color="#52525C"
            marginTop={4}
            marginLeft={100}
          />
          <Text style={{ fontSize: 20 }}>{product.unit}</Text>
        </View>
        <Button
          buttonStyle={styles.buttonStyle}
          title="ВИЖ ПРОДУКТА В САЙТА"
          onPress={() => {
            openURL(product.productUrl);
          }}
        />
        <View style={styles.divider} />
        <View style={styles.cardInfo}>
          <Entypo name="shop" size={28} color="#52525C" marginTop={2} />
          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 3 }}>
            {product.store.name}
          </Text>
          <FontAwesome
            name="map-marker"
            size={24}
            color="rgba(0, 153, 51,0.7)"
            marginLeft={5}
            marginTop={3}
          />
        </View>

        <Button
          title="Виж на картата"
          icon={<Icon name="map" type="material" size={20} color="white" />}
          buttonStyle={{ backgroundColor: "#80aaff" }}
          onPress={() => {
            navigation.navigate("SeeOnMapScreen", {
              locations: product.store.locations,
            });
          }}
        />
        <View style={styles.divider} />
        <Button
          title="Виж статистики"
          icon={
            <Icon name="insights" type="material" size={20} color="white" />
          }
          buttonStyle={{ backgroundColor: "#80aaff" }}
          onPress={() => {
            navigation.navigate("StatisticsScreen", {
              productUrl: product.productUrl,
              storeName: product.store.name,
              productTitle: product.title,
            });
          }}
        />
      </Card>
    </View>
  );
};

ProductDetailScreen.navigationOptions = {
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
    marginTop: 10,
    backgroundColor: "rgba(0, 153, 51,0.4)",
  },
  cardInfo: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10,
  },
  cartIconStyle: {
    alignItems: "flex-end",
  },
  divider: {
    height: 0.4,
    backgroundColor: "gray",
    marginTop: 8,
    marginBottom: 10,
  },
});
export default ProductDetailScreen;
