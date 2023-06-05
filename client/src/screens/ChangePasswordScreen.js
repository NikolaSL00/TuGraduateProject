import React, { useState } from "react";
import { View, StyleSheet, ScrollView, ToastAndroid } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import api from "../api/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  SearchBar,
  Card,
  Button,
  Text,
  Image,
  Input,
} from "react-native-elements";

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [selectedValue, setSelectedValue] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      const getUserLocation = async () => {
        try {
          const userEmailFromStorage = await AsyncStorage.getItem("userEmail");

          if (userEmailFromStorage) {
            setUserEmail(userEmailFromStorage);
          }
        } catch (error) {
          console.log("Грешка", error);
        }
      };

      getUserLocation();
    }, [])
  );

  const submit = async () => {
    const userEmail = await AsyncStorage.getItem("userEmail");

    if (newPassword != repeatNewPassword) {
      setErrorMessage("Паролите не съвпадат");
    } else {
      try {
        const response = await api.put("api/users/changePassword", {
          email: userEmail,
          oldPassword,
          newPassword,
        });
        ToastAndroid.show("Паролата е променена успешно!", ToastAndroid.LONG);
        navigation.goBack();
      } catch (error) {
        console.log(error.response.data.errors[0].message);
        setErrorMessage(error.response.data.errors[0].message);
        // setErrorMessage(error.response.data.errors);
      }
    }
  };

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

          <Input
            secureTextEntry
            label="Стара парола"
            value={oldPassword}
            onChangeText={setOldPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Input
            secureTextEntry
            label="Нова парола"
            value={newPassword}
            onChangeText={setNewPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Input
            secureTextEntry
            label="Повтори нова парола"
            value={repeatNewPassword}
            onChangeText={setRepeatNewPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Button
            buttonStyle={styles.buttonPasswordStyle}
            title="СМЕНИ ПАРОЛА"
            onPress={submit}
          />
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
        </View>
      </Card>
    </ScrollView>
  );
};

ChangePasswordScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 16,
    color: "red",
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 10,
  },
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
    marginBottom: 30,
  },
  buttonPasswordStyle: {
    backgroundColor: "rgba(0, 153, 51,0.4)",
    marginTop: 10,
    width: 320,
  },
});

export default ChangePasswordScreen;
