import React, { useContext } from "react";
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
