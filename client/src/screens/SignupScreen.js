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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValueChange = (value) => {
    setUserLocation(value);
  };

  const clearState = () => {
    setEmail("");
    setPassword("");
    setRepeatPassword("");
    setUserLocation("Изберете локация");
  };

  const onSubmit = () => {
    clearErrorMessage();

    if (password === repeatPassword) {
      setIsSubmitting(true);
      signup({
        email,
        password,
        userLocation,
        callback: () => setIsSubmitting(false),
      });
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
      clearState();
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
          isSubmitting={isSubmitting}
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
  },
  title: {
    color: "#52525C",
    textAlignVertical: "center",
    textAlign: "center",
    marginTop: 150,
  },
});

export default SignupScreen;
