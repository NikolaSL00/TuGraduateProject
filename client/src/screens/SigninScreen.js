import React, { useContext, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";

const SigninScreen = () => {
  const navigation = useNavigation();
  const { state, signin, clearErrorMessage } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    signin({ email, password });
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
    // <View style={styles.container}>
    //   <Text h1 style={styles.title}>
    //     ShopSmart
    //   </Text>
    //   <AuthForm
    //     errorMessage={state.errorMessage}
    //     submitButtonText="Вход"
    //     onSubmit={signin}
    //   />
    //   <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
    //     <NavLink
    //       navigation={navigation}
    //       routeName="Signup"
    //       text="Нямаш акаунт? Регистрирай се"
    //       style={styles.nav}
    //     />
    //   </TouchableOpacity>
    // </View>
  );
};

SigninScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 250,
  },
  title: {
    color: "#52525C",
    textAlignVertical: "center",
    textAlign: "center",
    marginTop: 90,
    marginBottom: 40,
  },
  nav: {},
});

export default SigninScreen;
