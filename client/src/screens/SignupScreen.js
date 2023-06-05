import React, { useContext, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";
const SignupScreen = () => {
  const navigation = useNavigation();
  const { state, signup, clearErrorMessage } = useContext(AuthContext);
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
        submitButtonText="Регистрация"
        signup="true"
        onSubmit={signup}
      />
      <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
        <NavLink
          navigation={navigation}
          routeName="Signin"
          text="Имаш акаунт? Влез"
        />
      </TouchableOpacity>
    </View>
  );
};

SignupScreen.navigationOptions = {
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
    marginTop: 200,
    marginBottom: 40,
  },
});

export default SignupScreen;
