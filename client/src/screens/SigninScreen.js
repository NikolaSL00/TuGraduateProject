import React, { useContext, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";
import KeyboardAvoidingComponent from "../components/KeyboardAvoidingComponent";

const SigninScreen = () => {
  const navigation = useNavigation();
  const { state, signin, clearErrorMessage } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = () => {
    setIsSubmitting(true);
    signin({ email, password, callback: () => setIsSubmitting(false) });
  };

  const clearState = () => {
    setEmail("");
    setPassword("");
  };

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
    { type: "button", title: "Bxoд", onSubmit },
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
          errorMessages={state.errorMessage}
          formElements={formElements}
          isSubmitting={isSubmitting}
        />
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <NavLink
            navigation={navigation}
            routeName="Signup"
            text="Нямаш акаунт? Регистрирай се"
            style={styles.nav}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingComponent>
  );
};

SigninScreen.navigationOptions = {
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
  },
  nav: {},
});

export default SigninScreen;
