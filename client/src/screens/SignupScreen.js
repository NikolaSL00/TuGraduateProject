import React, { useContext, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";

import KeyboardAvoidingComponent from "../components/KeyboardAvoidingComponent";

const SignupScreen = () => {
  const navigation = useNavigation();
  const { state, signup, clearErrorMessage } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [userLocation, setUserLocation] = useState("Изберете локация");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");

  const handleValueChange = (value) => {
    setUserLocation(value);
  };

  const onSubmit = () => {
    clearErrorMessage();

    if (password === repeatPassword) {
      signup({ email, password, userLocation });
      setRepeatPasswordError("");
    } else {
      setRepeatPasswordError("Паролите не са еднакви");
    }
  };
  const cities = ["Varna", "Sofia", "Plovdiv"];

  const formElements = [
    {
      type: "input",
      label: "Имейл",
      value: email,
      onChangeText: setEmail,
      autoCapitalize: "none",
      autoCorrect: false,
    },
    {
      type: "input",
      label: "Парола",
      value: password,
      onChangeText: setPassword,
      autoCapitalize: "none",
      autoCorrect: false,
      secureTextEntry: true,
    },
    {
      type: "input",
      label: "Повтори парола",
      value: repeatPassword,
      onChangeText: setRepeatPassword,
      autoCapitalize: "none",
      autoCorrect: false,
      secureTextEntry: true,
    },
    {
      type: "selectDropdown",
      data: cities,
      onSelect: handleValueChange,
      buttonTextAfterSelection: userLocation,
      defaultButtonText: userLocation,
    },
    { type: "button", title: "Регистрация", onSubmit },
  ];

  useFocusEffect(
    React.useCallback(() => {
      clearErrorMessage();
    }, [])
  );
  return (
    <KeyboardAvoidingComponent>
      <View style={styles.container}>
        <Text h1 style={styles.title}>
          ShopSmart
        </Text>
        <AuthForm
          errorMessages={[...state.errorMessage, repeatPasswordError]}
          formElements={formElements}
        />
        <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
          <NavLink
            navigation={navigation}
            routeName="Signin"
            text="Имаш акаунт? Влез"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingComponent>
  );
};

SignupScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 100,
  },
  title: {
    color: "#52525C",
    textAlignVertical: "center",
    textAlign: "center",
    marginTop: 200,
  },
});

export default SignupScreen;
