import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";

const SigninScreen = () => {
  const navigation = useNavigation();
  const { state, signin, clearErrorMessage } = useContext(AuthContext);
  useFocusEffect(
    React.useCallback(() => {
      clearErrorMessage();
    }, [])
  );
  
  return (
    <View style={styles.container}>
      <Text h1 style={styles.title}>
        ShopSmart
      </Text>
      <AuthForm
        errorMessage={state.errorMessage}
        submitButtonText="Вход"
        onSubmit={signin}
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
