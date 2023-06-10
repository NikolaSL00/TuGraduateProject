import React, { useState, useContext } from "react";
import { View, StyleSheet, ScrollView, ToastAndroid } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Button, Text } from "react-native-elements";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Context as AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/baseUrl";

const AccountScreen = () => {
  const { signout } = useContext(AuthContext);
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState("");
  const [userLocation, setUserLocation] = useState("Изберете локация");
  const [newChangedLocation, setNewChangedLocation] = useState(false);

  const cities = ["Varna", "Sofia", "Plovdiv"];

  const setNewLocation = async () => {
    const userEmail = await AsyncStorage.getItem("userEmail");

    try {
      const response = await api.put("api/users/changeLocationCity", {
        email: userEmail,
        locationCity: userLocation,
      });
      setUserLocation(userLocation);
      await AsyncStorage.removeItem("userLocationCity");
      await AsyncStorage.setItem("userLocationCity", userLocation);
      setNewChangedLocation(true);
      console.log(newChangedLocation);

      ToastAndroid.show("Успешно променена локация!", ToastAndroid.LONG);

      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };
  const handleValueChange = (value) => {
    setUserLocation(value);
  };

  useFocusEffect(
    React.useCallback(() => {
      const getUserLocation = async () => {
        try {
          const userEmailFromStorage = await AsyncStorage.getItem("userEmail");

          const userLocationCityFromStorage = await AsyncStorage.getItem(
            "userLocationCity"
          );
          if (userEmailFromStorage) {
            setUserEmail(userEmailFromStorage);
          }
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

  useFocusEffect(
    React.useCallback(() => {
      setUserLocation(userLocation);
    }, [])
  );
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Ionicons
            name="person-circle-outline"
            size={120}
            color={"rgba(0, 153, 51,0.4)"}
          />
          <Text style={styles.emailText}>{userEmail}</Text>
          <Button
            buttonStyle={styles.buttonPasswordStyle}
            title="СМЕНИ ПАРОЛА"
            onPress={() => {
              navigation.navigate("ChangePasswordScreen");
            }}
          />
          <Text style={styles.locationText}>Вашата локация</Text>

          <SelectDropdown
            data={cities}
            onSelect={handleValueChange}
            buttonTextAfterSelection={() => userLocation}
            rowTextForSelection={(item) => item}
            buttonStyle={styles.selectStyle}
            defaultButtonText={userLocation}
            renderDropdownIcon={(isOpened) => {
              return (
                <FontAwesome
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  color={"#444"}
                  size={18}
                />
              );
            }}
          />

          <Button
            buttonStyle={styles.buttonLocationStyle}
            title="ЗАДАЙ НОВА ЛОКАЦИЯ"
            onPress={setNewLocation}
          />

          <Button
            buttonStyle={styles.buttonLogoutStyle}
            title="ИЗХОД"
            onPress={signout}
          />
        </View>
      </Card>
    </ScrollView>
  );
};

AccountScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  card: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  emailText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 3,
    marginTop: 10,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 3,
    marginTop: 40,
    marginBottom: 10,
  },
  buttonPasswordStyle: {
    backgroundColor: "rgba(0, 153, 51,0.4)",
    marginTop: 10,
    width: 320,
  },
  buttonLocationStyle: {
    backgroundColor: "#80aaff",
    marginTop: 10,
    width: 320,
  },
  buttonLogoutStyle: {
    backgroundColor: "#737373",
    marginTop: 100,
    width: 320,
  },
  selectStyle: {
    marginTop: 10,
    marginBottom: 10,
    width: 320,
  },
});

export default AccountScreen;
