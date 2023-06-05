import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import Spacer from "./Spacer";

const AuthForm = ({ errorMessage, onSubmit, submitButtonText, signup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.view}>
      <Spacer></Spacer>
      <Input
        label="Имейл"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Input
        secureTextEntry
        label="Парола"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
      {signup ? (
        <Input
          secureTextEntry
          label="Повтори парола"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
      ) : null}
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      <Spacer>
        <Button
          title={submitButtonText}
          onPress={() => onSubmit({ email, password })}
          buttonStyle={styles.button}
        />
      </Spacer>
    </View>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 16,
    color: "red",
    marginLeft: 15,
    marginTop: 1,
  },
  button: {
    backgroundColor: "rgba(0, 153, 51,0.4)", //light green
    marginHorizontal: 10,
  },
  view: { marginHorizontal: 15, marginBottom: 40 },

  input: {},
});

export default AuthForm;
